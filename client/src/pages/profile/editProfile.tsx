import { useState } from "react";
import '../../constants/i18next'
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom'; 

import Loading from "../../components/shared/loadingScreen";
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


export function EditProfile() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const currentUser = FIREBASE_AUTH.currentUser; 
    const navigate = useNavigate(); 


    const [message ] = useState(""); 
    const [error] = useState(false); 

    return (
      <div className="mt-5">
        {!loading ? (
          <>
            
          </>
        ) : (
          <Loading />
        )}
      </div>
    );
}