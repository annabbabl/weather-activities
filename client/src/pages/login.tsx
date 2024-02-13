import {
    Card,
    Input,
    Button,
    Typography,
  } from "@material-tailwind/react";
import React, { useState } from "react";
import '../constants/i18next'
import { useTranslation } from "react-i18next";
import { StandartBlueWave } from "./shared/waves";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; 
import {SetAlert} from "../constants/popUps";
import { DefautlProps } from "../types/component.props";
import Loading from "./shared/loadingScreen";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

   
export function Login({ setError, setMessage, message, error }: DefautlProps) {
    const { t } = useTranslation();
    const auth = getAuth();

    const navigate = useNavigate(); 

    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = async () => {
      setLoading(true);
    
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken(); 
    
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });
    
        const data = await response.json();
        
        if (response.ok) {
          console.log(data);
          navigate('/profile');
          setMessage?.(t('signUpSuccessfull'));
          setError?.(false);
        } else {
          throw new Error(data.message || 'Login failed');
        }
        navigate('/profile');
      } catch (error) {
        console.error(error);
        setMessage?.(t('loginError'));
        setError?.(true);
      } finally {
        setLoading(false);
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
  