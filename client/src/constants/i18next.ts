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
                about: "About",

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
                notLoggedIn:"Not logged in",
                
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
                sunday:"Sunday",

                //about Page
                aboutMeText:"Hello, I'm Anna Stabel, the creator of Weather Activity. I'm passionate about helping people make the most of their days, rain or shine. With Weather Activity, I aim to provide a platform where users can share and discover exciting activities based on their location and the weather forecast. Join me in exploring new adventures and making every day memorable!",
                infoText:"Welcome to Weather Activity! Discover new ways to enjoy every day with our platform. Create your profile, explore suggestions from users around the world, and share your own favorite activities. Whether it's sunny or raining, find something exciting to do that suits the weather in your area. Let's make every day an adventure together!"
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
                about:"Informationen",

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
                notLoggedIn:"Nicht eingelloged",

                
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
                sunday:"Sontag",

                //about page
                infoText:"Willkommen bei Weather Activity! Entdecke neue Möglichkeiten, jeden Tag mit unserer Plattform zu genießen. Erstelle dein Profil, erkunde Vorschläge von Benutzern aus der ganzen Welt und teile deine eigenen Lieblingsaktivitäten. Egal, ob es sonnig ist oder regnet, finde eine aufregende Aktivität, die zum Wetter in deiner Region passt. Lass uns gemeinsam jeden Tag zu einem Abenteuer machen!",
                aboutMeText: "Hallo, ich bin Anna Stabel, die Schöpferin von Weather Activity. Ich bin leidenschaftlich daran interessiert, Menschen zu helfen, das Beste aus ihren Tagen herauszuholen, ob Regen oder Sonnenschein. Mit Weather Activity möchte ich eine Plattform bieten, auf der Benutzer aufgrund ihres Standorts und der Wettervorhersage aufregende Aktivitäten teilen und entdecken können. Begleite mich dabei, neue Abenteuer zu erkunden und jeden Tag unvergesslich zu machen!"
            }
        }
    }
  });
export default i18n;