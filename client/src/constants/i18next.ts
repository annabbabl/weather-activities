import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
        en: {
            translation: {
                //main
                activities: "Activities",
                profile: "Profile",
                upperBar: "Upper Bar",

                //common
                saved: "Saved",
                save: "Save",
                update: "Update", 
                cancel:"Cancel",
                edit:"Edit",
                post:"Post",
                upload:"Upload",

                //profile
                email: "Email", 
                username: "Username",
                password: "Password", 
                signUp: "Sign Up", 
                signIn: "Sign In",
                haveNoAccount: "You do not have an account ? ",
                haveAccount: "You already have an account? ",
                yourPosts: 'Your Posts',
                niceRegister: 'Thank you for you Registration!', 
                register: "Register",
                loggout: "Loggout",
                signOut:"Sign Out",
                savePW:"Save Password",
                noPostsYet: "No Posts Yet",


                //error
                signUpFail: "Sign Up Fail", 
                registerError: "Registration Error",
                userSettingsUpdateError: 'User Settings Update Error',
                logoutError:"Error while Looging out",
                uploadError: "Error Uploading",
                signOutFail:"Sign Out Fail",
                
                //success
                signUpSuccessfull: "Sign Up Successfull", 
                signOutSuccessfull: "Sign Out Successfull", 
                registered: "Registered",
                updatedSuccessfully: "Updated Successfully",
                logoutSuccess:"Logged out",
                uploadedSuccessfully:"Uploaded Successfully",

                //activities

                //day of weeks
                monday: "Monday", 
                tuesday:"Tuesday", 
                wensday:"Wensday",
                thursday:"Thursday", 
                friday:"Friday",
                saturday:"Saturday", 
                sunday:"Sunday"

            }

        }, 
        de: {
                translation: {
                //main
                activities: "Aktivitäten", 
                profile: "Profil",
                upperBar: "Navigation",

                //common
                saved: "Saved",
                save: "Speichern",
                update: "Update", 
                cancel:"Abbrechen",
                edit:"Ändern",
                post: "Post",
                upload:"Hochladen",

                //profile
                email: "Email", 
                username: "Benutzername",
                password: "Passwort", 
                signUp: "Registrieren", 
                signIn: "Einloggen",
                haveNoAccount: "Du hast noch keinen Account ? ",
                haveAccount: "Du hast schon keinen Account ? ",
                yourPosts: 'Deine Posts',
                niceRegister: 'Danke für deine Registrierung!',
                register: "Registerieren", 
                loggout: "Ausloggen",
                signOut:"Ausloggen",
                savePW:"Passwort speichern",
                noPostsYet: "Du hast noch keine posts",

                //error
                signUpFail: "Login Fehler", 
                registerError: "Fehler bei der Registrierung",
                userSettingsUpdateError: 'Fehler beim Update',
                logoutError:"Fehler beim Ausloggen",
                uploadError: "Fehler beim Hochladen",
                signOutFail:"Sign Out Fail",

                
                //success
                signUpSuccessfull: "Erfolgreich Eingelloged!", 
                registered:"Erfolgreich registriert", 
                updatedSuccessfully:"Erfolgreich Geupdated",
                logoutSuccess:"Erfolgreich Ausgelloget",
                uploadedSuccessfully:"Erfolgreich Hochgeladen",

                //activities

                //day of weeks
                monday: "Montag", 
                tuesday:"Dienstag", 
                wensday:"Mittwoch",
                thursday:"Donnerstag", 
                friday:"Freitag",
                saturday:"Samstag", 
                sunday:"Sontag"

            }
        }
    }
  });
export default i18n;