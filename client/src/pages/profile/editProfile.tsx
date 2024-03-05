/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Card,
    Input,
    Button,
    Typography,
  } from "@material-tailwind/react";
import { useState } from "react";
import '../../constants/i18next'
import { useTranslation } from "react-i18next";
import { AuthProps } from "../../types/component.props";
import { useNavigate } from 'react-router-dom'; 
import { updateEmail } from "firebase/auth";
import { updatePassword, updateProfile } from "firebase/auth";
import {SetAlert} from "../../constants/popUps";
import Loading from "../../components/shared/loadingScreen";
import { UserEdit } from "../../types/databaseTypes";
import {FIREBASE_AUTH} from "../../firebase.config"

/**
 * A React component for editing user profile information such as username, email, and password.
 * This component provides input fields for the user to update their profile details and
 * communicates with the backend server to update these details.
 * It leverages Material Tailwind components for UI and Firebase for authentication and user data updates.
 * Upon successful update, the user is navigated back to their profile page.
 *
 * @component
 * @example
 * <EditProfile 
 *   username="johndoe"
 *   password="password123"
 *   email="john.doe@example.com"
 *   imgUrl="http://example.com/avatar.jpg"
 *   setEmail={setEmail}
 *   setPassword={setPassword}
 *   setUsername={setUsername}
 *   setEdit={setEdit}
 *   setMessage={setMessage}
 *   setError={setError}
 * />
 *
 * @param {AuthProps} props - The properties passed to the EditProfile component.
 * @param {string} props.username - The current username of the user.
 * @param {string} props.password - The current password of the user.
 * @param {string} props.email - The current email of the user.
 * @param {string} props.imgUrl - The current profile image URL of the user.
 * @param {Function} props.setEmail - Setter function to update the email state.
 * @param {Function} props.setPassword - Setter function to update the password state.
 * @param {Function} props.setUsername - Setter function to update the username state.
 * @param {Function} props.setEdit - Setter function to control edit mode in parent component.
 * @param {Function} props.setMessage - Setter function to set a message for display.
 * @param {Function} props.setError - Setter function to set error state for display.
 * @returns {React.ReactElement} A form allowing users to edit their profile information.
 */


export function EditProfile({username, password, email, imgUrl, setEmail, setPassword, setUsername, setEdit, setMessage, setError }: AuthProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const currentUser = FIREBASE_AUTH.currentUser; 
    const navigate = useNavigate(); 


    const [message ] = useState(""); 
    const [error] = useState(false); 

    const updateUserSettings = async() => {

      if(!currentUser){
        navigate('/login');
        return
      }

      try{
        setLoading(true); 
        const idToken = await currentUser.getIdToken(true);


        const updatedUserData : UserEdit = {
          id: currentUser.uid,
          email: email, 
          password: password, 
          username: username,
        }

        const response = await fetch(`http://localhost:3001/profile/editProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(updatedUserData),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data);
          setMessage?.(t('userSettingsUpdateError'));
          setError?.(false);

          const localemail = email ? email : ""
          const localpassword = password ? password : ""
          
          updateProfile(currentUser, {displayName:  username, photoURL: imgUrl})
          await updatePassword(currentUser, localpassword);
          await updateEmail(currentUser, localemail);
          
          setEdit?.(false)
          navigate('/profile');
        } else {
          throw new Error(data.message || 'updating failed');
        }

      } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/user-token-expired') {
            navigate('/login'); 
            setMessage?.(t('sessionExpired')); 
        } else {
            setMessage?.(t('error')); 
        }
        setError?.(true);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="mt-5">
        {!loading ? (
          <>
            <Card color="transparent" shadow={false} placeholder="form">
              <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 shadow-[0_3px_10px_rgb(0,0,0,0.2)]  border-4 px-8 py-4">
                <div className="mb-1 flex flex-col gap-6">
                  <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('username')}>
                    {t('username')}
                  </Typography>
                  <Input
                    size="lg"
                    placeholder={username}
                    onChange={(e) => setUsername?.(e.target.value)}
                    value={username}
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    crossOrigin={undefined}                    />
                  <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('email')}>
                    {t('email')}
                  </Typography>
                  <Input
                    size="lg"
                    placeholder={email}
                    onChange={(e) => setEmail?.(e.target.value)}
                    value={email}
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                    crossOrigin={undefined}       
                  />
                  <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('password')}>
                    {t('password')}
                  </Typography>
                  <Input
                    type="password"
                    size="lg"
                    onChange={(e) => setPassword?.(e.target.value)}
                    value={password}
                    autoComplete="on"
                    placeholder={password}
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{ className: "before:content-none after:content-none" }}
                    crossOrigin={undefined}       
                  />
                </div>
                <Button className="mt-6 bg-blue-700 text-white w-full" placeholder={t('save')} onClick={updateUserSettings}>
                  {t('save')}
                </Button>
                <Button className="mt-6 bg-blue-700 text-white w-full" placeholder={t('save')} onClick={() => setEdit?.(false)}>
                  {t('cancel')}
                </Button>
              </form>
            </Card>
            <SetAlert error={error} message={message} />
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
}