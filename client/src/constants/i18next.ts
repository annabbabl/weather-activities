import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';


/**
 * Initializes i18next with several plugins and configuration settings.
 * Backend - Loads translations from a server.
 * LanguageDetector - Detects the user's language.
 * initReactI18next - Initializes the React binding for i18next.
 * Object of language keys and their translation strings in Englisch and German
 */

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
                send: "Send",

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
                typeHere: "Type Here",
                attachFile: "Attach File", 
                emoji: "Emoji",
                bold: "Bold",
                italic:"Italic", 
                underline: "Underline", 
                insertLink: "Insert Link",
                textStile: "Textstyle",
                heading1: "Heading 1",
                heading2: "Heading 2",
                heading3: "Heading 3",
                paragraph: "Paragraph",
                writePost: 'Write A Post', 
                noPostYet: "No Posts Yet",
                snow: "Snow", 
                clearSky: "Clear Sky", 
                scatteredClouds: "Clouds",
                brokenClouds: "Clouds", 
                thunderstorm: "Thunderstorm", 
                showerRain: "Rain",
                mist: "Mist", 
                thunderstormWithLightRain: "Thunderstorm with light rain",
                thunderstormwithrain: "Thunderstorm with rain",
                thunderstormwithheavyrain: "Thunderstorm with heavy rain",
                lightthunderstorm: "Light thunderstorm",
                heavythunderstorm: "Heavy thunderstorm",
                raggedthunderstorm: "Ragged thunderstorm",
                thunderstorwithlightdrizzle: "Thunderstorm with light drizzle",
                thunderstormwithdrizzle: "Thunderstorm with drizzle",
                thunderstormwithheavydrizzle: "Thunderstorm with heavy drizzle",
                lightintensitydrizzle: "Light intensity drizzle",
                drizzle: "Drizzle",
                heavyintensitydrizzle: "Heavy intensity drizzle",
                lightintensitydrizzlerain: "Light intensity drizzle rain",
                drizzlerain: "Drizzle rain",
                heavyintensitydrizzlerain: "Heavy intensity drizzle rain",
                showerrainanddrizzle: "Shower rain and drizzle",
                heavyshowerrainanddrizzle: "Heavy shower rain and drizzle",
                showerdrizzle: "Shower drizzle",
                lightrain: "Light rain",
                moderaterai: "Moderate rain",
                heavyintensityrain: "Heavy intensity rain",
                veryheavyrain: "Very heavy rain",
                extremerain: "Extreme rain",
                freezingrain: "Freezing rain",
                lightintensityshowerrain: "Light intensity shower rain",
                showerrain: "Shower rain",
                heavyintensityshowerrain: "Heavy intensity shower rain",
                raggedshowerrain: "Ragged shower rain",
                lightsnow: "Light snow",
                heavysnow: "Heavy snow",
                slee: "Sleet",
                lightshowersleet: "Light shower sleet",
                showersleet: "Shower sleet",
                lightrainandsnow: "Light rain and snow",
                rainandsnow: "Rain and snow",
                lightshowersnow: "Light shower snow",
                showersnow: "Shower snow",
                heavyshowersnow: "Heavy shower snow",
                smoke: "Smoke",
                haze: "Haze",
                sanddustwhirls: "Sand/dust whirls",
                fog: "Fog",
                sand: "Sand",
                dust: "Dust",
                volcanicash: "Volcanic ash",
                squalls: "Squalls",
                tornado: "Tornado",
                clearsky: "Clear sky",
                fewclouds: "Few clouds",
                scatteredclouds: "Scattered clouds",
                brokenclouds: "Broken clouds",
                overcastclouds: "Overcast clouds",
                moderaterain: "Moderate Rain" ,
                postFrom: "Post from",
                failedSavePost: "Failed to save",

                //day of weeks
                Monday: "Monday", 
                Tuesday:"Tuesday", 
                Wednesday:"Wensday",
                Thursday:"Thursday", 
                Friday:"Friday",
                Saturday:"Saturday", 
                Sunday:"Sunday",
                monday: "Monday", 
                tuesday:"Tuesday", 
                wednesday:"Wensday",
                thursday:"Thursday", 
                friday:"Friday",
                saturday:"Saturday", 
                tempertaure:"Temperature",
                sunday:"Sunday",
                temperature: "Temperature",
                raining:"Raining",
                profilePicture: "Profile Picture",
                liked:"Liked",
                failedLikingPost:"Failed Liking Post",
                postSaved: "Post Saved",
                image: "Image",
                information: "Information",
                infomration : "Information",
                description: "Description",
                createdOn: "Created on",
                messages:"Messages",


                //about Page
                aboutMeText:"Hello, I'm Anna Stabel, the creator of Weather Activity. I'm passionate about helping people make the most of their days, rain or shine. With Weather Activity, I aim to provide a platform where users can share and discover exciting activities based on their location and the weather forecast. Join me in exploring new adventures and making every day memorable!",
                infoText:"Welcome to Weather Activity! Discover new ways to enjoy every day with our platform. Create your profile, explore suggestions from users around the world, and share your own favorite activities. Whether it's sunny or raining, find something exciting to do that suits the weather in your area. Let's make every day an adventure together!",

                //Saved Page 
                noSavedPostsYet: "No Saved Posts Yet",
                noSavedNoSignUp: "You are not Signed Up Yet",
                savedPosts: "Saved Posts", 
                
                //not found
                noFound: "Page Not found 404",
                sorryNotFound: "Sorry, we could not find your page", 
                homepage:"Homepage",
                pleaseGo: "Please go back to the homepage or contact us if you believe this page should exist"

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
                send:"Senden",

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
                failedSavePost: "Fehler beim Speichern des Posts",


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
                typeHere: "Hier Tippen",
                attachFile: "Datei Anhängen", 
                emoji: "Emoji",
                bold: "Fett",
                italic:"Kurisv", 
                underline: "Unterstrichen", 
                insertLink: "Link einfügen",
                textStile: "Textstil",
                heading1: "Heading 1",
                heading2: "Heading 2",
                heading3: "Heading 3",
                paragraph: "Paragraph",
                writePost: 'Schreibe einen Post', 
                noPostYet: 'Es wurden noch keine Posts veröffentlicht',
                snow: "Schnee", 
                clearSky: "klarer Himmel", 
                scatteredClouds: "Wolkig",
                brokenClouds: "Wolkig", 
                thunderstorm: "Gewitter", 
                showerRain: "Regen",
                mist: "Nebel", 
                thunderstormWithLightRain: "Gewitter mit leichtem Regen",
                thunderstormwithrain: "Gewitter mit Regen",
                thunderstormwithheavyrain: "Gewitter mit starkem Regen",
                lightthunderstorm: "Leichtes Gewitter",
                heavythunderstorm: "Schweres Gewitter",
                raggedthunderstorm: "Unregelmäßiges Gewitter",
                thunderstorwithlightdrizzle: "Gewitter mit leichtem Nieselregen",
                thunderstormwithdrizzle: "Gewitter mit Nieselregen",
                thunderstormwithheavydrizzle: "Gewitter mit starkem Nieselregen",
                lightintensitydrizzle: "Leichter Nieselregen",
                drizzle: "Nieselregen",
                heavyintensitydrizzle: "Starker Nieselregen",
                lightintensitydrizzlerain: "Leichter Nieselregen",
                drizzlerain: "Nieselregen",
                heavyintensitydrizzlerain: "Starker Nieselregen",
                showerrainanddrizzle: "Regenschauer und Nieselregen",
                heavyshowerrainanddrizzle: "Starker Regenschauer und Nieselregen",
                showerdrizzle: "Schauer-Nieselregen",
                lightrain: "Leichter Regen",
                moderaterai: "Mäßiger Regen",
                heavyintensityrain: "Starkregen",
                veryheavyrain: "Sehr starker Regen",
                extremerain: "Extremer Regen",
                freezingrain: "Eisregen",
                lightintensityshowerrain: "Leichter Schauerregen",
                showerrain: "Schauerregen",
                heavyintensityshowerrain: "Starker Schauerregen",
                raggedshowerrain: "Unregelmäßiger Schauerregen",
                lightsnow: "Leichter Schneefall",
                heavysnow: "Starker Schneefall",
                slee: "Schneeregen",
                lightshowersleet: "Leichter Schneeregenschauer",
                showersleet: "Schneeregenschauer",
                lightrainandsnow: "Leichter Regen und Schnee",
                rainandsnow: "Regen und Schnee",
                lightshowersnow: "Leichter Schneeschauer",
                showersnow: "Schneeschauer",
                heavyshowersnow: "Starker Schneeschauer",
                smoke: "Rauch",
                haze: "Dunst",
                sanddustwhirls: "Sand-/Staubwirbel",
                fog: "Nebel",
                sand: "Sand",
                dust: "Staub",
                volcanicash: "Vulkanasche",
                squalls: "Böen",
                tornado: "Tornado",
                clearsky: "Klarer Himmel",
                fewclouds: "Wenige Wolken",
                scatteredclouds: "Zerstreute Wolken",
                brokenclouds: "Zerbrochene Wolken",
                overcastclouds: "Bedeckte Wolken",
                moderaterain: "Leichter Regen" ,
                postFrom: "Post von",
                createdOn: "Erstellt am",



                //day of weeks
                Monday: "Montag", 
                Tuesday:"Dienstag", 
                Wednesday:"Mittwoch",
                Thursday:"Donnerstag", 
                Friday:"Freitag",
                Saturday:"Samstag", 
                Sunday:"Sontag",
                monday: "Montag", 
                tuesday:"Dienstag", 
                wednesday:"Mittwoch",
                thursday:"Donnerstag", 
                friday:"Freitag",
                saturday:"Samstag", 
                sunday:"Sontag",
                tempertaure:"Temperatur",
                temperature: "Temperatur",
                raining:"Regen",
                profilePicture: "Profilbild",
                liked:"Geliked",
                failedLikingPost:"Like fehlgeschlagen",
                postSaved: "Post gespeichert",
                image: "Bild",
                information: "Information",
                infomration : "Information",
                description: "Beschreibung",


                //about page
                infoText:"Willkommen bei Weather Activity! Entdecke neue Möglichkeiten, jeden Tag mit unserer Plattform zu genießen. Erstelle dein Profil, erkunde Vorschläge von Benutzern aus der ganzen Welt und teile deine eigenen Lieblingsaktivitäten. Egal, ob es sonnig ist oder regnet, finde eine aufregende Aktivität, die zum Wetter in deiner Region passt. Lass uns gemeinsam jeden Tag zu einem Abenteuer machen!",
                aboutMeText: "Hallo, ich bin Anna Stabel, die Schöpferin von Weather Activity. Ich bin leidenschaftlich daran interessiert, Menschen zu helfen, das Beste aus ihren Tagen herauszuholen, ob Regen oder Sonnenschein. Mit Weather Activity möchte ich eine Plattform bieten, auf der Benutzer aufgrund ihres Standorts und der Wettervorhersage aufregende Aktivitäten teilen und entdecken können. Begleite mich dabei, neue Abenteuer zu erkunden und jeden Tag unvergesslich zu machen!",
                
                
                //Saved Page 
                noSavedPostsYet: "Du hast noch keine Posts gespeichert",
                noSavedNoSignUp: "Du bist noch nicht eingeloggt",
                savedPosts: "Gespeicherte Posts",

                //not found
                noFound: "Die Wwebsite konnte nicht gefunden werden 404",
                sorryNotFound: "Es tut uns leid, wir konnten die Website niocht finden", 
                homepage:"Homepage",
                pleaseGo: "Bitte gehen sie zurück zur Homepage"
            }
        }
    }
  });
export default i18n;