import Box from '@mui/material/Box';
import { Button, Typography } from "@material-tailwind/react";
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FIREBASE_AUTH, FIRESTORE, FIRE_STORAGE } from '../../api/firebase/firebase.config.ts';
import { PostEdit, UserEdit } from '../../types/databaseTypes';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { ReactSVG } from 'react-svg';
import { StandartBlueWave } from '../shared/waves.tsx';
import { AuthProps } from '../../types/component.props';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button as FileUpload, styled } from '@mui/material';
import { SetAlert } from '../../constants/popUps.tsx';
import { EditProfile } from './editProfile.tsx';
import Loading from '../shared/loadingScreen.tsx';
import React from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ProfilePage({ edit, setError, setMessage, message, setEdit, error }: AuthProps) {
  const { t } = useTranslation();
  const currentUser = FIREBASE_AUTH.currentUser
  const usersCollection = collection(FIRESTORE, 'users');
  const navigate = useNavigate(); 

  const postsCollection = collection(FIRESTORE, 'posts');

  const [email, setEmail] = useState(currentUser?.email)
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(currentUser?.displayName)
  const [userData, setUserData] = useState<UserEdit>({})

  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function getUserWithPosts(userId: string | undefined): Promise<void> {
    try {
      setLoading(true);

      // Fetch user data
      const userDocRef = doc(usersCollection, currentUser?.uid);

      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data() as UserEdit;

      // Fetch posts created by the user
      const postsQuery = query(postsCollection, where('createdBy', '==', userId));
      const postsQuerySnapshot = await getDocs(postsQuery);

      // Map posts data
      const postsData: PostEdit[] = [];
      postsQuerySnapshot.forEach((doc) => {
        const postData = doc.data() as PostEdit;
        postsData.push(postData);
      });

      // Combine user data and posts data
      const userWithPosts: UserEdit = {
        ...userData,
        posts: postsData,
      };

      // Update userData state
      setUserData(userWithPosts);
    } catch (error) {
      console.error('Error fetching user with posts:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser?.uid) {
      const unsubscribe = onSnapshot(query(postsCollection, where('createdBy', '==', currentUser?.uid)), (_snapshot) => {
        getUserWithPosts(currentUser?.uid);
      });

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  useEffect(() => {
    if (currentUser?.uid) {
      getUserWithPosts(currentUser?.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  useEffect(() => {
    setImgUrl(userData?.profilePicture ? userData.profilePicture : "");
  }, [userData]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await FIREBASE_AUTH.signOut()

      const loggedOutUserData: UserEdit = {
        loggedIn: false
      }
      const userDocRef = doc(usersCollection, currentUser?.uid);

      updateDoc(userDocRef, loggedOutUserData)
        .then(() => {
          console.log('Document successfully updated!');
          console.log(response)
          console.log(t('logoutSuccess'))
        })
        .catch((error: any) => {
          console.error('Error updating document:', error);
          console.log(t('logoutError'))
          setMessage?.(t('logoutError')); 
          setError?.(true); 
          throw error;
      });
      navigate('/');
    } catch (error: any) {
      console.log(error, error)
      console.log(t('logoutError'))
      setMessage?.(t('logoutError')); 
      setError?.(true); 
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    
    if (!file) return;

    setLoading(true);

    const storageRef = ref(FIRE_STORAGE, `p/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      () => {
      },
      (error) => {
        alert(error);
        setMessage?.(t('uploadError'))
        setError?.(true)
        setLoading(false); 
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL)
          console.log(imgUrl,898)
          console.log(downloadURL,898)

          const profilePictureData : UserEdit = {
            profilePicture: downloadURL
          }

          const userDocRef = doc(collection(FIRESTORE, 'users'), FIREBASE_AUTH.currentUser?.uid);

          updateDoc(userDocRef, profilePictureData)
            .then(() => {
                console.log('Document successfully updated!');
                console.log('Document successfully updated!')
            })
            .catch((error: any) => {
                console.error('Error updating document:', error);
                console.log(t('uploadError'))
                setMessage?.(t('uploadError'))
                setError?.(true)
                throw error;
          })
          setMessage?.(t('uploadedSuccessfully'))
          setLoading(false); 
        });
      }
    );
  }
  return (
    <div className="flex flex-col justify-between items-center h-screen ">
      {!loading ? (
        <><div className=" mt-5 ">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            {!edit ? (
              <div className="mt-8 mb-19 w-80 max-w-screen-lg sm:w-96 ">
                <Typography className='mb-10' variant="h1" placeholder={t('profile')}>{t('profile')}</Typography>
                <div className="flex mb-9 ">
                  {userData?.profilePicture ? (
                    <Avatar src={imgUrl} alt={(username ? username : "")} sx={{ width: 120, height: 120 }} />
                  ) : (
                    <Avatar alt={(username ? username : "")} sx={{ width: 120, height: 120 }}>{(username ? username[0] : "U")} </Avatar>
                  )}
                  <div className='flex flex-col justify-end mx-4'>
                    <Typography variant="h4" placeholder={username}>{username}</Typography>
                    <FileUpload component="label" variant="text" startIcon={<FileUploadIcon />}>
                      {t('upload')}
                      <VisuallyHiddenInput type="file" onChange={handlePictureUpload} />
                    </FileUpload>
                  </div>
                </div>
                <div>
                  <div className='shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]  border-4 '>
                    <div className='flex flex-row justify-evenly mt-5'>
                      <Typography variant="h4" placeholder={t('username')}>{t('username')}</Typography>
                      <Typography variant="lead" placeholder={t('username')}>{username}</Typography>
                    </div>
                    <div className='flex flex-row justify-evenly mb-10'>
                      <Typography variant="h4" placeholder={t('email')} className='ml-7'>{t('email')}</Typography>
                      <Typography variant="lead" placeholder={t('email')}>{email}</Typography>
                    </div>
                  </div>
                  <div className=''>
                    <Button className="mt-6 text-white w-full bg-blue-700" placeholder={t('edit')} onClick={() => setEdit?.(true)} loading={loading}>
                      {t('edit')}
                    </Button>
                  </div>
                  <div className="justify-end mb-11">
                    <Button className="mt-6 bg-blue-700  w-full" placeholder={t('signOut')} onClick={handleLogout} loading={loading}>
                      {t('signOut')}
                    </Button>
                  </div>
                  {userData?.posts && userData?.posts?.length > 0 ? (
                    <div className='my-16 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] '>
                      <Typography variant="h4" placeholder={t('yourPosts')}>{t('yourPosts')}</Typography>
                      <Box sx={{ width: '100%', typography: 'body1' }}>
                        {userData?.posts.map((post: PostEdit) => (
                          <Typography key={post.id} variant="h4" placeholder={t('post')}>{post.title}</Typography>
                        ))}
                      </Box>
                    </div>
                  ) : (
                    <Typography variant="h4" placeholder={t('noPostsYet')}>{t('noPostsYet')}</Typography>
                  )}
                </div>
              </div>
            ) : (
              <EditProfile
                username={(username ? username : "")}
                password={password}
                email={email ? email : ""}
                setEmail={setEmail}
                setPassword={setPassword}
                setUsername={setUsername}
                setEdit={setEdit} />
            )}
          </Box>
        </div><SetAlert error={error} message={(message ? message : "")} /><ReactSVG src="../../assets/Sun.svg" /><div className="flex justify-end w-screen h-80">
            <StandartBlueWave />
          </div></>):(
        <Loading/>
      )}
  </div>
  );
}