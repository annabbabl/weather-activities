import React, { useState } from "react";
import { Card, Input, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { StandartBlueWave } from "../components/shared/waves";
import { Link, useNavigate } from "react-router-dom"; 
import { SetAlert } from "../constants/popUps";
import { DefautlProps } from "../types/component.props";
import Loading from "../components/shared/loadingScreen";
import { FIREBASE_AUTH } from "../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TypographyH3, TypographyH6 } from "../components/components";

export function Login({ setError, setMessage, message, error }: DefautlProps) {
  const { t } = useTranslation();
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch('http://localhost:3001/login', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        navigate('/');
        setMessage?.(t('signUpSuccessfull'));
        setError?.(false);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setMessage?.('An error occurred');
      setError?.(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center h-screen">
      {!loading ? (
        <>
          <div className="justify-center mt-5">
            <Card color="transparent" shadow={false} placeholder={"form"}>
              <TypographyH3 text="signIn" />
              <form className="mt-1 w-80 max-w-screen-lg sm:w-96 shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-black border-4 px-8 py-4">
                <div className="mb-1 flex flex-col gap-6">
                  <TypographyH6 text="email" />
                  <Input
                    size="lg"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }} crossOrigin={undefined} />
                  <TypographyH6 text="password" />
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
                <Button className="mt-10 bg-black text-white w-full" onClick={handleLogin} placeholder={t('signIn')}>
                  {t('signIn')}
                </Button>
                <div className="flex flex-row">
                  <TypographyH6 text="haveNoAccount"/>
                  <Link to="/registration" className="text-blue-600 hover:text-blue-800 ml-2">
                    {t('register')}
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
