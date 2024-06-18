import React, { useEffect, useState } from "react";
import {
    Card,
    Input,
    Button,
} from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../constants/i18next'
import { useTranslation } from "react-i18next";
import Loading from "react-loading";
import { TypographyH3, TypographyH6 } from "../../components/components";
import { StandartBlueWave } from "../../components/shared/waves";
import { SetAlert } from "../../constants/popUps";
import { DefautlProps } from "../../types/component.props";
import { UserStatus, UserInformation } from "../../types/databaseTypes";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



export function RegistrationForm({ setError, setMessage, message, error }: DefautlProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [userStatus, setUserStatus] = useState<UserStatus>('candidate');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [containsCandidate, setContainsCandidate] = useState(false);

    const pathname = location.pathname; 


      // if(containsCandidate){
                //     try{
                //         const response = await fetch('http://localhost:3001/registration/candidate-check', {
                //             method: 'POST',
                //             headers: {
                //                 'Content-Type': 'application/json',
                //             },
                //             body: JSON.stringify(registeredUserObject)
                //         });
                            // if (!response.ok) {
                            //     throw new Error('Registration failed');
                            // }

                //     } catch (error: any) {
                //         console.error(error);
                //         setMessage?.(t('registerError'));
                //         setError?.(true);
                //     }
                // }

    useEffect(() => {
        if(pathname.includes('candidate')){
            setContainsCandidate(true)
            setUserStatus("candidate");
        }
        if (pathname.includes('admin')) {
            setUserStatus('admin');
        }
    }, [pathname]);

    const handleRegistration = async () => {
        setLoading(true);

        if(email === "" || password === "" || displayName === ""){
            setMessage?.(t('notEnoughInformation'));
            setError?.(true);
            throw new Error('Not enough information');
        }

        const registeredUserObject: UserInformation = { 
            email, 
            password, 
            displayName,
            userStatus 
        };
        try {
            const response = await fetch('http://localhost:3001/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registeredUserObject),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            console.log('Registration successful', data);
            setMessage?.(t('registered'));

            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);

            if(containsCandidate){
                navigate(`/registration/candidate/candidate-info`);
            } else {
                navigate('/');
            }
        } catch (error: any) {
            console.error(error);
            setMessage?.(t('registerError'));
            setError?.(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-between items-center h-screen">
            {!loading ? (
                <>
                    <div className="flex justify-center mt-5 w-5/6 items-center">
                        <Card color="transparent" shadow={false} className="w-full max-w-md" placeholder={t("register")}>
                            <TypographyH3 text="register" />
                            <form className="mt-8 mb-2 w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-8 py-4 border-black border-4">
                                <div className="mb-5 flex flex-col gap-6">
                                    <TypographyH6 text="email" />
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
                                    <TypographyH6 text="name" />
                                    <Input
                                        size="lg"
                                        placeholder="name"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                                        value={displayName}
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        crossOrigin={undefined} />
                                </div>
                                <div className="mb-1 flex flex-col gap-6">
                                    <TypographyH6 text="password" />
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
                                <Button className="mt-5 bg-black text-white w-full" onClick={handleRegistration} placeholder={t('register')}>
                                    {t('register')}
                                </Button>
                                <div className="flex flex-row">
                                    <TypographyH6 text="haveAccount"/>
                                    <Link to="/login" className="text-blue-600 hover:text-blue-800 ml-2">
                                        {t('signIn')}
                                    </Link>
                                </div>
                            </form>
                        </Card>
                    </div>
                    <SetAlert error={error} message={message ? message : ""} />
                    <div className="flex justify-end w-screen h-80">
                        <StandartBlueWave />
                    </div>
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
}
