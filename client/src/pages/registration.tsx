import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import {Link} from 'react-router-dom';
import '../constants/i18next.ts'
import { useTranslation } from "react-i18next";
import { StandartBlueWave } from "./shared/waves.tsx";
import { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE } from "../api/firebase/firebase.config.ts";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; 
import { User } from "../types/databaseTypes";
import { collection, doc, setDoc } from "firebase/firestore";
import { ReactSVG } from "react-svg";
import {SetAlert} from "../constants/popUps.tsx";
import { DefautlProps } from "../types/component.props";
import Loading from "./shared/loadingScreen.tsx";
import React from "react";



export function RegistrationForm({ setError, setMessage, message, error }: DefautlProps) {
    const { t } = useTranslation();

    const usersCollection = collection(FIRESTORE, 'users');
    const createdAt = Date.now();
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

   
    const handleRegistration = async () => {
      try{
        setLoading(true)

        if(username === null){
          console.log(t('registrationFail'))
        }else{
          const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        
          const newUser : User = {
            email: email,
            username: username,
            loggedIn: false,
            password: password,
            created_at: createdAt
          }
          const userDocRef = doc(usersCollection, response.user.uid);
          
          setDoc(userDocRef, newUser)
            .then(async () => {
              console.log('Document written with ID:', response.user.uid);
              await updateProfile(response.user, { displayName: username });
            })
            .catch((error: Error) => {
              console.error('Error adding document:', error);
              setMessage?.(t('registerError'))
              setError?.(true)
          });    
        }
        navigate('/profile');
        setMessage?.(t('registered'))

      }catch(error: any){
        console.log(error)
        setMessage?.(t('registerError'))
        setError?.(true)
        throw error
      }finally{
        setLoading(false)
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
                </div><ReactSVG src="../assets/Sun.svg" /><SetAlert error={error} message={(message ? message : "")} /><div className="flex justify-end w-screen h-80">
                        <StandartBlueWave />
                    </div></>): (
                    <Loading/>
                )}
        </div>
    );
}
