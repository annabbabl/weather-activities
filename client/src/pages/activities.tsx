import { TabContext, TabList } from '@mui/lab';
import Tab from '@mui/material/Tab';
import '../constants/i18next'
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { DefautlProps } from '../types/component.props';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.config';
import Loading from '../components/shared/loadingScreen';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Typography } from '@material-tailwind/react';
import {LocationOn, DeviceThermostat} from '@mui/icons-material';
import { SetAlert } from '../constants/popUps';
import { Likes, PostEdit, Weather } from '../types/databaseTypes';
import PostComponent from '../components/shared/postComponent';
import { Box } from '@mui/material';
import FlipMove from 'react-flip-move';
import { BAD_WEATHER_COLORS, GOOD_WEATHER_COLORS, IMAGE_STYLE_COVER, SNOW_COLORS, IMAGES } from '../constants/theme';
import QuillMessage from '../components/shared/BlazorQuill';
import WeatherIcon from '../components/shared/weatherIcon';


/**
 * Functional React component for the activities screen.
 * This component displays weather information, and allows for new posts creation.
 * It includes dynamic weather-based theming and utilizes a parallax effect for an engaging user experience.
 * The screen also provides functionality to log out the current user.
 *
 * @component
 * @example
 * <ActivitiesScreen 
 *   setMessage={setMessage}
 *   setError={setError}
 *   message="Success"
 *   error={false}
 * />
 *
 * @param {DefautlProps} props The properties passed to the ActivitiesScreen component.
 * @param {Function} props.setMessage Setter function to update the message state.
 * @param {Function} props.setError Setter function to update the error state.
 * @param {string} props.message Current message to be displayed.
 * @param {boolean} props.error Indicates if there is an error state.
 * @returns {React.ReactElement} The React component for the activities screen.
 */

export default function ActivitiesScreen({setPath, setMessage, setError, message, error}: DefautlProps) {
    const { t } = useTranslation();
    const currentUser = FIREBASE_AUTH.currentUser;

    const [loading, setLoading] = useState<boolean>(false)
    const [likes, setLikes] = useState<Likes>({} as Likes)
    const [city, setCity] = useState("");
    const [posts, setPosts] = useState<Array<PostEdit>>([]);
    const [weatherData, setWeatherData] = useState<Array<Weather>>([]);
    const [currentWeatherData, setCurrentWeatherData] = useState<Weather>();
    const [savedPosts, setSavedPosts] = useState<Array<string>>([])
    const [weatherTheme, setWeatherTheme] = useState(GOOD_WEATHER_COLORS)
    const [imageUrl, setImageUrl] = useState(IMAGES.sun)



    const getNextSevenDays = () =>  {
        const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today: number = new Date().getDay(); 
        const nextSevenDays: string[] = [];
    
        for (let i = 0; i < 7; i++) {
            const nextDayIndex: number = (today + i) % 7; 
            nextSevenDays.push(days[nextDayIndex]);
        }
    
        return nextSevenDays;
    }

    const nextSevenDays: string[] = getNextSevenDays();
    const [day, setDay] = useState(nextSevenDays[0]);

    const editString = (str: string) => {
        if(str){
            const editedString = String(str)
            .replace(/ /g, '') 
            .replace(/%/g, '') 
            .replace(/[0-9]/g, '') 
            .replace(/\//g, '') 
            .replace(/-/g, '')
            .toLowerCase()
            return editedString
        }else{
            return ""
        }
       
    }

    const addNewPost = (newPost: PostEdit) => {
        setPosts(prevPosts => [...prevPosts, newPost]);
    };


    const successFetchingLocation = useCallback(async (pos: any) => {
        const crd = pos.coords;
        const { longitude, latitude } = crd;
    
        try {
            setLoading(true);
            const response = await fetch(
                `https://us1.locationiq.com/v1/reverse.php?key=pk.b375d1e83f32113df3e2c98c5f5c9816&lat=${latitude}&lon=${longitude}&format=json`
            );
            
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const data = await response.json();
            const city = data.address.city || data.address.town;
            setCity(city);
    
            const parsedData = currentUser ? {
                idToken: currentUser.uid,
                city: city,
                longitude: longitude,
                latitude: latitude
            } : {
                city: city,
                longitude: longitude,
                latitude: latitude
            };
    
            console.log(parsedData, "Parsed Data for Server");
    
            const serverResponse = await fetch('http://localhost:3001/setLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedData),
            });
    
            const serverData = await serverResponse.json();
            if (!serverResponse.ok) {
                throw new Error('Server response was not ok.');
            }
    
            console.log(serverData, "Server Response Data");
        } catch (error) {
            console.error('Error fetching location:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]); 
    

    const errorFetchingLocation = useCallback(() => {
        try{

        }catch(error) {
            console.error("error")
            console.log(error)
        }

    }, []);


    const handleChange = (_event: React.SyntheticEvent, newDay: string) => {
        setDay(newDay);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            };

            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    console.log(result);
                    if (result.state === "granted") {
                        navigator.geolocation.getCurrentPosition(successFetchingLocation, errorFetchingLocation, options);
                    } else if (result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(successFetchingLocation, errorFetchingLocation, options);
                    } else if (result.state === "denied") {
                        console.log("Premssion Denied")
                    }
                });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, [errorFetchingLocation, successFetchingLocation]);

    useEffect(() => {
        const fetchUserCityAndSavePosts = async () => {
            if(currentUser){
                try {
                    setLoading(true);
                    const userDocRef = doc(FIRESTORE, 'users', currentUser.uid);  
                    const docSnap = await getDoc(userDocRef);
                  
                    if (docSnap.exists()) {
                        console.log("User data:", docSnap.data().city); 
                        if(docSnap.data().city){
                            setCity(docSnap.data().city);
                        }
                        if(docSnap.data().savedPosts){
                            setSavedPosts(docSnap.data().savedPosts)
                        }
                    } else {
                        console.log("No user found with uid:", currentUser.uid);
                    }
                
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setMessage?.(t('error'));
                    setError?.(true);
                } finally {
                    setLoading(false);
                }
            }else{
                console.log("No user logged in");
            }  
        };

        fetchUserCityAndSavePosts()
        
       
    }, [day, currentUser, city, setMessage, t, setError]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (!city) return; 
            try {
                setLoading(true);
                const weatherCollectionRef = collection(FIRESTORE, "weatherInformation");
                const q = query(weatherCollectionRef, where("city", "==", city));
                const weatherDocSnapshot = await getDocs(q);
        
                if (!weatherDocSnapshot.empty) {
                    const weatherDataArray = weatherDocSnapshot.docs.map(doc => doc.data());
                    setWeatherData(weatherDataArray);
                } else {
                    console.log("No weather data for:", city);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeatherData();
    }, [city]);

    useEffect(() => {
        const currentData = weatherData.filter((data: any) => data.day === day)[0]
        setCurrentWeatherData(currentData || null); 
    }, [weatherData, day]);

    useEffect(() => {
        const fetchPostData = async () => {
            if (!city || !currentWeatherData?.date) return;
    
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            try {
                setLoading(true);
                const postsCollectionRef = collection(FIRESTORE, "posts");
                let q;
    
                if (city) {
                    // Query posts by city and createdFor date range
                    q = query(postsCollectionRef, 
                              where("city", "==", city), 
                              where("createdFor", "==", currentWeatherData.day))
                } else {
                    // Query posts by createdFor date range only
                    q = query(postsCollectionRef, 
                        where("createdFor", "==", currentWeatherData.day))
                    }
                const postDocSnapshot = await getDocs(q);

                if (!postDocSnapshot.empty) {

                    let postDataArray = postDocSnapshot.docs.map(doc => {
                        const docData = doc.data();
                        const likes = docData.likes ? {
                            amount: docData.likes.amount || 0,
                            likedUser: docData.likes.likedUser || [],
                        } : { amount: 0, likedUser: [] };
                        return {
                            id: doc.id,
                            likes,
                            ...docData,
                        };
                    });

                    postDataArray = postDataArray.sort((a, b) => b.likes.amount - a.likes.amount);
                    setPosts(postDataArray);
                } else {
                    console.log("No posts data for:", city, "and date", currentWeatherData?.date);
                    setPosts([]);
                }
            } catch (error) {
                console.error('Error fetching posts data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [city, currentWeatherData]);

    useEffect(() => {
        if (currentWeatherData?.weather) {
            const description = currentWeatherData.weather[0]?.main.toLowerCase();
            switch (true) {
                case description.includes('clear') || description.includes('clouds'):
                    setWeatherTheme(GOOD_WEATHER_COLORS);
                    setImageUrl(IMAGES.sun)
                    break;
                case description.includes('snow'):
                    setWeatherTheme(SNOW_COLORS);
                    setImageUrl(IMAGES.snow)
                    break;
                default: // Treat other conditions as bad weather
                    setWeatherTheme(BAD_WEATHER_COLORS);
                    setImageUrl(IMAGES.cloud)
                    break;
            }
        }
    }, [currentWeatherData]);

    return (
        <div className='flex flex-col w-full  mt-10  justify-center items-center'>
            <div className='flex flex-col w-full items-center  justify-center' style={{...IMAGE_STYLE_COVER, backgroundImage: `url(${imageUrl})`}}>
                {!loading ? (
                    <>
                        <TabContext value={day}>
                            <div className="w-5/6 rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]" 
                            style={{
                                backgroundColor: weatherTheme.forthColor,
                                color: weatherTheme.thirdColor === "#0C4160" ? "#C3CEDA" : weatherTheme.thirdColor,
                                borderColor: weatherTheme.thirdColor,
                            }}>
                                <TabList onChange={handleChange} aria-label="upperBar" textColor="inherit" centered>
                                    {nextSevenDays.map((day, index) => (
                                        index !== 6 ? (
                                            <div key={day} className={`border-r-2 w-1/5 font-bold hover:bg-blue-700 hover:text-white 
                                                hover:shadow-[0_20px_50px_rgba(8,_80,_184,_0.7)] ${day === 'Monday'}`}
                                                onClick={() => setDay(day)}
                                            >
                                                <Tab label={t(day)} value={day} style={{ fontWeight: "bold" }}/>
                                            </div>
                                        ) : (
                                            <div key={day} className={`hover:bg-blue-700 font-bold hover:text-white w-1/5 ${day === "Sunday" ? 'bg-customYellow text-blue-700' : ''}`}
                                                onClick={() => setDay(day)}
                                            >
                                                <Tab label={t(day.toLowerCase())} value={day} style={{ fontWeight: "bold" }}/>
                                            </div>
                                        )
                                    ))}
                                </TabList>
                            </div>
                        </TabContext>
                        <div className="w-5/6 p-10 border-t-0 shadow-[rgba(40,_38,_76,_0.19)_0px_9px_20px] overflow-y-auto max-h-[900px] min-h-[100px]" 
                        style={{
                            backgroundColor: weatherTheme.secondaryColor === "#0C4160" ? "#C3CEDA":  weatherTheme.secondaryColor,
                            color: "white",
                            borderColor: weatherTheme.secondaryColor,
                        }}>
                            <Box sx={{  height: '50vh', maxHeight: '8rem', padding: '1rem', background: weatherTheme.thirdColor, boxShadow: 'shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]', borderRadius: 5 }}>
                                {weatherData && (
                                    <div className='flex flex-row justify-between sticky top-0 z-10 p-5'>
                                        <div className="me-2 flex flex-row items-center">
                                            <Typography variant="h6" placeholder={t('infomration')}>
                                                {`${city}, ${currentWeatherData?.formattedDate ? currentWeatherData.formattedDate: ""}`}
                                            </Typography>
                                            <LocationOn fontSize='small'/>
                                        </div>
                                        <div className="me-2 flex flex-row items-center">
                                            <Typography variant="h6" placeholder={t('temperature')}>
                                                {`${currentWeatherData?.temp?.min ?? ""}°C - ${currentWeatherData?.temp?.max ?? ""}°C`}
                                            </Typography>
                                            <DeviceThermostat fontSize='small'/>
                                        </div>
                                        <div className="me-4 flex flex-row items-center">
                                            <Typography variant="h6" placeholder={t('description')}>
                                                {t(editString(currentWeatherData?.weather[0]?.description))}
                                            </Typography>
                                            <WeatherIcon weatherDescription={currentWeatherData?.weather[0]?.description ?? ""}/>
                                        </div>
                                    </div>
                                )}
                            </Box>
                            {posts.length > 0 ? (
                                <div className='flex flex-col items-center'>
                                    <FlipMove duration={750} easing="ease-out">
                                        {posts.map((post) => (
                                            <PostComponent 
                                                key={post.id}
                                                post={post}
                                                setError={setError}
                                                setMessage={setMessage}
                                                setLoading={setLoading}
                                                currentUser={currentUser}
                                                setLikes={setLikes}
                                                likes={likes}
                                                postLikes={post.likes ?? {}}
                                                savedPosts={savedPosts}
                                                setPath={setPath}
                                            />
                                        ))}
                                    </FlipMove>
                                </div>
                            ) : (
                                <Typography variant="h3" className='mt-5' placeholder={t('information')} style={{textAlign:"center"}}>
                                    {t('noPostYet')}
                                </Typography>
                            )}
                        </div>
                    </>
                ) : (
                    <Loading />
                )}
            </div>
            <div className="flex flex-row mt-10 border-blue-700 rounded-md items-center w-5/6 justify-center">
                <SetAlert error={error} message={message ?? ""} />
                <QuillMessage 
                    setLoading={setLoading}
                    createdBy={currentUser?.uid}
                    username={currentUser?.displayName}
                    userId={currentUser?.uid}
                    userImage={currentUser?.photoURL}
                    city={city}
                    day={day}
                    weather={currentWeatherData?.weather[0]?.description}
                    addNewPost={addNewPost}
                />
            </div>
           
        </div>
    );
}