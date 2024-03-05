import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import {Link} from 'react-router-dom';
import '../constants/i18next'
import { useTranslation } from "react-i18next";
import { StandartBlueWave } from "../components/shared/waves";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { ReactSVG } from "react-svg";
import {SetAlert} from "../constants/popUps";
import { DefautlProps } from "../types/component.props";
import Loading from "../components/shared/loadingScreen";
import React from "react";
import { UserEdit } from "../types/databaseTypes";


/**
 * Functional React component for the registration form.
 * This component provides a user interface for signing up new users with email, username, and password.
 * It performs validation and communication with the backend server to create new user accounts.
 * Upon successful registration, the user is navigated to the profile page.
 * The component also manages loading states and displays error messages using the SetAlert component.
 *
 * @component
 * @example
 * <RegistrationForm 
 *   setError={setError}
 *   setMessage={setMessage}
 *   message="Please fill all fields."
 *   error={true}
 * />
 *
 * @param {DefautlProps} props - The properties passed to the RegistrationForm component.
 * @param {Function} props.setError - Setter function to update the error state.
 * @param {Function} props.setMessage - Setter function to update the message state.
 * @param {string} props.message - Current message to be displayed as feedback.
 * @param {boolean} props.error - Indicates if there is an error state.
 * @returns {React.ReactElement} A React component for the registration form screen.
 */


export function RegistrationForm({ setError, setMessage, message, error }: DefautlProps) {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

   
    const handleRegistration = async () => {
        try {
            setLoading(true);

            const userData: UserEdit = { 
                email: email, 
                password: password, 
                username: username, 
                loggedIn: true 
            }
    
            const response = await fetch('http://localhost:3001/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) {
                throw new Error('Registration failed');
            }
    
            const data = await response.json();
            console.log('Registration successful', data);
            setMessage?.(t('registered'));
            navigate('/profile');
        } catch (error) {
            console.error(error);
            setMessage?.(t('registerError'));
            setError?.(true);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col justify-between items-center h-screen ">
             {!loading ? (
                <><div className="flex justify-center mt-5  w-5/6 items-center">
                    <Card color="transparent" shadow={false} placeholder={"form"} className="w-full max-w-md">
                        <Typography variant="h4" color="blue-gray" placeholder={t('signUp')}>
                            {t('signUp')}
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal" placeholder={t('register')}>
                            {t('niceRegister')}
                        </Typography>
                        <form className="mt-8 mb-2 w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-8 py-4 border-blue-700 border-4">
                            <div className="mb-5 flex flex-col gap-6">
                                <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('email')}>
                                    {t('email')}
                                </Typography>
                                <Input
                                    size="lg"
                                    placeholder="name@mail.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                    crossOrigin={undefined} />
                            </div>
                            <div className="mb-5 flex flex-col gap-6">
                                <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('username')}>
                                    {t('username')}
                                </Typography>
                                <Input
                                    size="lg"
                                    placeholder="name"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    value={username}
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                    crossOrigin={undefined} />
                                {/* Remaining input fields */}
                            </div>
                            <div className="mb-1 flex flex-col gap-6">
                                <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('password')}>
                                    {t('password')}
                                </Typography>
                                <Input
                                    autoComplete="on"
                                    type="password"
                                    size="lg"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    placeholder="********"
                                    className=" !border-t-bg-sky-600 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }} crossOrigin={undefined} />
                            </div>
                            <Button className="mt-20 bg-blue-700 text-white w-full" loading={loading} placeholder={t('signUp')} onClick={handleRegistration}>
                                {t('signUp')}
                            </Button>
                            <Typography className="mt-4 text-center font-normal text-black" placeholder={t('haveAccount')}>
                                {t('haveAccount')}{" "}
                            </Typography>
                            <Link to="/login" color="blue" style={{ color: "blue" }}>{t('signIn')}</Link>
                        </form>
                    </Card>
                </div>
                <ReactSVG src="../assets/Sun.svg" />
                <SetAlert error={error} message={(message ? message : "")} />
                <div className="flex justify-end w-screen h-80">
                    <StandartBlueWave />
                </div>
                </>): (
                <Loading/>
                )}
        </div>
    );
}
