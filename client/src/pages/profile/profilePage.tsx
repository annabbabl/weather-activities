import Box from '@mui/material/Box';
import { Button, Typography } from "@material-tailwind/react";
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ReactSVG } from 'react-svg';
import { signOut, updateProfile } from "firebase/auth";
import { StandartBlueWave } from '../../components/shared/waves';
import { AuthProps } from '../../types/component.props';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button as FileUpload, styled } from '@mui/material';
import { SetAlert } from '../../constants/popUps';
import { EditProfile } from './editProfile';
import Loading from '../../components/shared/loadingScreen';
import { PostEdit } from '../../types/databaseTypes';
import {FIREBASE_AUTH, FIRESTORE} from "../../firebase.config"
import { collection, doc, getDocs, query, where } from 'firebase/firestore';


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

export default function ProfilePage({ edit, setError, setMessage, message, setEdit, error, setPath }: AuthProps) {
  const { t } = useTranslation();
  const currentUser = FIREBASE_AUTH.currentUser
  const navigate = useNavigate(); 

  const [email, setEmail] = useState(currentUser?.email)
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(currentUser?.displayName)
  const [posts, setPosts] = useState<Array<PostEdit>>([])

  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchUserData = async () => {      
      try {
          setLoading(true);
          const userCollectionRef = collection(FIRESTORE, "users");
          const userDoc = doc(userCollectionRef, currentUser?.uid);
  
          if (userDoc) {
            setImgUrl(currentUser?.photoURL ? currentUser?.photoURL : "");
          } else {
            console.log("No user Data");
          }

          const postCollectionRef = collection(FIRESTORE, "postCollection");
          const q = query(postCollectionRef, where("createdBy", "==", currentUser?.uid));
          const postDocSnapshot = await getDocs(q);

          if (!postDocSnapshot.empty) {
            const weatherDataArray = postDocSnapshot.docs.map(doc => doc.data());
            setPosts(weatherDataArray);
        } else {
            console.log("No posts for user");
        }

      } catch (error) {
          console.error('Error fetching user data:', error);
      } finally {
         setLoading(false);
      }
    };
    fetchUserData()
  }, [currentUser?.photoURL, currentUser?.uid]);


  const handleLogout = async () => {
    if (!currentUser?.uid) {
      return;
    }
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/profile/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: currentUser.uid }),
        });
  
        const data = await response.json();
       
        if (response.ok) {
          console.log(data);
          await signOut(FIREBASE_AUTH);
          navigate('/aboutPage');
          setMessage?.(t('signUpSuccessfull'));
          setError?.(false);
          setPath?.("/")
        } 
      } catch (error: any) {
        console.log(error, error)
        console.log(t('logoutError'))
        throw error;
      } finally {
        setLoading(false);
      }
    setMessage?.(t('notLoggedIn')); 
    setError?.(true); 
  }

  const handlePictureUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('uid', currentUser.uid);

        const response = await fetch('http://localhost:3001/profile/uploadPicture', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('File upload failed');

        if (currentUser) {
          updateProfile(currentUser, { photoURL: imgUrl })
            .then(async () => {
              const { downloadURL } = await response.json();
              setImgUrl(downloadURL);
              setMessage?.('File uploaded successfully');
              setError?.(false);
            })
            .catch((error: any) => {
              console.log(error)
            });
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        setMessage?.('Error uploading file');
        setError?.(true);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex flex-col justify-between items-center h-screen ">
      {!loading ? (
        <><div className=" mt-5 ">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            {!edit ? (
              <div className="mt-8 mb-19 w-80 max-w-screen-lg sm:w-96 ">
                <Typography className='mb-10' variant="h1" placeholder={t('profile')}>{t('profile')}</Typography>
                <div className="flex mb-9 ">
                  {currentUser?.photoURL ? (
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
                  <div className='shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] border-4 border-blue-700'>
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
                    <Button className="mt-6 text-white w-full bg-blue-700" placeholder={t('edit')} onClick={
                      () => {setEdit?.(true); setMessage?.(""); setError?.(false)}} loading={loading}>
                      {t('edit')}
                    </Button>
                  </div>
                  <div className="justify-end mb-11">
                    <Button className="mt-6 bg-blue-700  w-full" placeholder={t('signOut')} onClick={handleLogout} loading={loading}>
                      {t('signOut')}
                    </Button>
                  </div>
                  
                  {posts && posts.length > 0 ? (
                    <div className='my-16 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] '>
                      <Typography variant="h4" placeholder={t('yourPosts')}>{t('yourPosts')}</Typography>
                      <Box sx={{ width: '100%', typography: 'body1' }}>
                        {posts.map((post: PostEdit) => (
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
                setEdit={setEdit} 
                imgUrl={imgUrl}
              />
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