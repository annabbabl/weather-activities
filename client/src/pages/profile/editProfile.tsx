/* eslint-disable jsx-a11y/anchor-is-valid */
import {
    Card,
    Input,
    Button,
    Typography,
  } from "@material-tailwind/react";
import { useState } from "react";
import '../../constants/i18next.ts'
import { useTranslation } from "react-i18next";
import { AuthProps } from "../../types/component.props";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { User, UserEdit } from '../../types/databaseTypes';
import { FIREBASE_AUTH, FIRESTORE } from "../../api/firebase/firebase.config.ts";
import { updatePassword, updateProfile } from "firebase/auth";
import {SetAlert} from "../../constants/popUps.tsx";
import Loading from "../shared/loadingScreen.tsx";
import React from "react";
   
export function EditProfile({username, password, email, setEmail, setPassword, setUsername, setEdit}: AuthProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const currentUser = FIREBASE_AUTH.currentUser; 
    const usersCollection = collection(FIRESTORE, 'users');
    const userDocRef = doc(usersCollection, currentUser?.uid);

    const [message, setMessage] = useState(""); 
    const [error, setError] = useState(false); 

    const localUsername = username ? username : ""
    const localemail = email ? email : ""
    const localpassword = password ? password : ""


    const checkDocumentExists = async (collectionRef: any, documentId:string) => {
      const docRef = doc(collectionRef, documentId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    };
    

    const updateUserSettings = async() => {
      if (currentUser) {
        setLoading(true); 
        const documentExists = await checkDocumentExists(usersCollection, currentUser?.uid);
        updateProfile(currentUser, { displayName: localUsername })
          .then(async () => {

            if(documentExists){
              const updatedUserData : UserEdit = {
                email: email,
                username: localUsername,
                password: password
              }
              updateDoc(userDocRef, updatedUserData)
                .then(() => {
                    console.log('Document successfully updated!');
                    console.log('Document successfully updated!')
                })
                .catch((error: any) => {
                    console.error('Error updating document:', error);
                    console.log(t('userSettingsUpdateError'))
                    setMessage(t('userSettingsUpdateError'))
                    setError(true)
                    throw error;
                }).finally(() => {
                    setLoading(false); 
                });
            }else{
              const newUser : User = {
                email: localemail,
                username: localUsername,
                loggedIn: false,
                password: localpassword,
                created_at: Date.now()
              }

              setDoc(userDocRef, newUser)
                .then(async () => {
                  console.log('Document written with ID:', currentUser?.uid);
                })
                .catch((error: Error) => {
                  console.error('Error adding document:', error);
                  setMessage(t('userSettingsUpdateError'))
                  setError(true)
              });    
            }
            setMessage(t('updatedSuccessfully'))
          })
          .catch((error: any) => {
            console.error("Error updating user profile:", error.message);
            console.log(t('userSettingsUpdateError'))
            setMessage(t('userSettingsUpdateError'))
            setError(true)
            throw error;
          }).finally(() => {
            setLoading(false); 
            setEdit?.(false)
          });
      }
    };

    const changeUserPassword = async () => {
        try {
            if (!currentUser) {
                throw new Error('User not signed in.');
            }
            await updatePassword(currentUser, localpassword);

            const updatedUser : UserEdit = {
                id: currentUser.uid,
                email: email,
                username: username,
                loggedIn: true,
                password: password
            }

            updateDoc(userDocRef, updatedUser)
                .then(() => {
                    console.log('Document successfully updated!');
                    console.log(t('userPasswordsUpdateSuccess'))
                })
                .catch((error: any) => {
                    console.error('Error updating document:', error);
                    console.log(t('userPasswordUpdateError'))
                    throw error;
                });
        } catch (error: any) {
            console.log(t('userPasswordUpdateError'))
            console.error('Error updating password:', error.message);
            throw error;
        }finally{
          setEdit?.(false)
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
                  <Button className="mt-6 bg-blue-700 text-white w-full" placeholder={t('save')} onClick={changeUserPassword}>
                    {t('savePW')}
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