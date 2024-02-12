/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Card,
    Input,
    Button,
    Typography,
  } from "@material-tailwind/react";
import React, { useState } from "react";
import '../constants/i18next.ts'
import { useTranslation } from "react-i18next";
import { StandartBlueWave } from "./shared/waves.tsx";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE } from "../api/firebase/firebase.config.ts";
import {SetAlert} from "../constants/popUps.tsx";
import { UserEdit } from "../types/databaseTypes";
import { collection, doc, updateDoc } from "firebase/firestore";
import { DefautlProps } from "../types/component.props";
import Loading from "./shared/loadingScreen.tsx";
   
export function Login({ setError, setMessage, message, error }: DefautlProps) {
    const { t } = useTranslation();
    const navigate = useNavigate(); 

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = async () => {
      try{
        setLoading(true)
        const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
        console.log(response)
        console.log(t('signUpSuccessfull'))
        navigate('/profile');
        setMessage?.(t('signUpSuccessfull'));
        setError?.(true);

        const loggedInData : UserEdit = {
          loggedIn: false
        }
        const usersCollection = collection(FIRESTORE, 'users');
        const userDocRef = doc(usersCollection, FIREBASE_AUTH.currentUser?.uid);

        updateDoc(userDocRef, loggedInData)
        .then(() => {
            console.log('Document successfully updated!');
            console.log("Document successfully updated!")
        })
        .catch((error: any) => {
            console.error('Error updating document:', error);
            console.log(t('signUpFail'))
            setMessage?.(t('signOutFail'))
            setError?.(true)
            throw error;
        }).finally(() => {
            setLoading(false); 
        });
        setMessage?.(t('logoutError'))
      }catch(error: any){
        console.log(error, error)
        console.log(t('logoutError'))
        setError?.(true);
        setMessage?.(t('logoutError'));
        throw error
      }finally{
        setLoading(false)
      }
    };

    return (
      <div className="flex flex-col justify-between items-center h-screen">
         {!loading ? (
          <><div className="justify-center mt-5">

            <Card color="transparent" shadow={false} placeholder={"form"}>
              <Typography variant="h4" className="text-blue-700" placeholder={t('signUp')}>
                {t('signIn')}
              </Typography>
              <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-blue-700 border-4 px-8 py-4">
                <div className="mb-1 flex flex-col gap-6">
                  <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('username')}>
                    {t('email')}
                  </Typography>
                  <Input
                    size="lg"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }} crossOrigin={undefined} />
                  <Typography variant="h6" className="-mb-3 text-blue-700" placeholder={t('password')}>
                    {t('password')}
                  </Typography>
                  <Input
                    type="password"
                    autoComplete="on"
                    size="lg"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="********"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }} crossOrigin={undefined} />
                </div>
                <Button className="mt-20 bg-blue-700 text-white w-full" loading={loading} placeholder={t('signIn')} onClick={handleLogin}>
                  {t('signIn')}
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal" placeholder={t('haveNoAccount')}>
                  {t('haveNoAccount')}{" "}
                  <Link to="/registration" color="blue" style={{ color: "blue" }}>{t('signIn')}</Link>
                </Typography>
              </form>
            </Card>
          </div><SetAlert error={error} message={(message ? message : "")} /><div className="flex justify-end w-screen h-80">
              <StandartBlueWave />
            </div></>
        ): (
          <Loading />
        )}
    </div>
    );
  }
  