import Box from '@mui/material/Box';
import { Button, Typography } from "@material-tailwind/react";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { signOut } from "firebase/auth";
import { StandartBlueWave } from '../../components/shared/waves';
import { AuthProps } from '../../types/component.props';
import { styled } from '@mui/material';
import { SetAlert } from '../../constants/popUps';
import { EditProfile } from './editProfile';
import Loading from '../../components/shared/loadingScreen';
import { PostEdit } from '../../types/databaseTypes';
import {FIREBASE_AUTH, FIRESTORE} from "../../firebase.config"
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import FlipMove from 'react-flip-move';
import PostComponent from '../../components/shared/postComponent';
import { IMAGES, IMAGE_STYLE_CONTAIN } from '../../constants/theme';


/**
 * Functional React component for user's profile page.
 * This component displays the user's profile information such as username, and email.
 * It provides functionality to edit the profile and log out.
 * The page also lists the user's posts if available and handles loading states and error messages.
 *
 * @component
 * @example
 * <ProfilePage 
 *   edit={false}
 *   setError={setError}
 *   setMessage={setMessage}
 *   message={""}
 *   setEdit={setEdit}
 *   error={false}
 *   setPath={setPath}
 * />
 *
 * @param {AuthProps} props The properties passed to the ProfilePage component.
 * @param {boolean} props.edit Determines whether the edit mode is enabled.
 * @param {Function} props.setError Setter function to update the error state.
 * @param {Function} props.setMessage Setter function to set the message state.
 * @param {string} props.message Current message to be displayed as an alert.
 * @param {Function} props.setEdit Setter function to control edit mode in parent component.
 * @param {boolean} props.error Indicates whether there is an error state.
 * @param {Function} props.setPath Setter function to update the current navigation path.
 * @returns {React.ReactElement} A React component for displaying and interacting with the user's profile page.
 */

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

          const postCollectionRef = collection(FIRESTORE, "posts");
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
  

  return (
    <div className="flex flex-col justify-between items-center h-screen ">
      {!loading ? (
        <><div className=" mt-5 ">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            {!edit ? (
              <div className="mt-8 mb-19 w-80 max-w-screen-lg sm:w-96 ">
                <Typography className='mb-10' variant="h1" placeholder={t('profile')}>{t('profile')}</Typography>
                <div className="flex mb-9 ">
                 
                </div>
                <div style={{...IMAGE_STYLE_CONTAIN, backgroundImage: `url(${IMAGES.sun})`}}>
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
                </div>
                  {posts && posts.length > 0 ? (
                    <div >
                      <Typography variant="h4" placeholder={t('yourPosts')} style={{marginBottom: "10%"}}>{t('yourPosts')}</Typography>
                      <FlipMove duration={750} easing="ease-out">
                            {posts.map((post) => (
                                <PostComponent 
                                  key={post.id}
                                  post={post}
                                  setError={setError}
                                  setMessage={setMessage}
                                  setLoading={setLoading}
                                  currentUser={currentUser}
                                  postLikes={post.likes ?? {}}                          />
                              ))}
                        </FlipMove>
                    </div>
                  ) : (
                    <Typography variant="h4" placeholder={t('noPostsYet')}>{t('noPostsYet')}</Typography>
                  )}
                
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
        </div>
        <SetAlert error={error} message={(message ? message : "")} />
        <div className="flex justify-end w-screen h-80">
          <StandartBlueWave />
        </div></>):(
        <Loading/>
      )}
  </div>
  );
}