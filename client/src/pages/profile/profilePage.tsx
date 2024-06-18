import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { signOut } from "firebase/auth";
import { StandartBlueWave } from '../../components/shared/waves';
import { styled } from '@mui/material';
import Loading from '../../components/shared/loadingScreen';
import { FIREBASE_AUTH } from '../../firebase.config';


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

export default function ProfilePage() {
  const { t } = useTranslation();
  const currentUser = FIREBASE_AUTH.currentUser
  const navigate = useNavigate(); 

  const [email, setEmail] = useState(currentUser?.email)
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(currentUser?.displayName)

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
          navigate('/homepage');
        } 
      } catch (error: any) {
        console.log(error, error)
        console.log(t('logoutError'))
        throw error;
      } finally {
        setLoading(false);
      }
  
  }

  useEffect(() => {
    const fetchUserData = async () => {      
      try {
          setLoading(true);
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
        </div>
        <div className="flex justify-end w-screen h-80">
          <StandartBlueWave />
        </div></>):(
        <Loading/>
      )}
  </div>
  );
}