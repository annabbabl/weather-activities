import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import '../../constants/i18next'
import { TabContext, TabList , TabPanel} from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { RegistrationForm } from '../../pages/registration';
import { Login } from '../../pages/login';
import ProfilePage from '../../pages/profile/profilePage';
import ActivitiesScreen from '../../pages/activities';
import { GOOD_WEATHER_COLORS } from '../../constants/theme';
import AboutPage from '../../pages/aboutPage';
import { FIREBASE_AUTH } from '../../firebase.config';
import SavePage from '../../pages/savePage';
import { AnimatePresence } from "framer-motion";
import MessagePage from '../../pages/messagePage';

/**
 * Functional React component for the upper navigation bar.
 * This component utilizes MUI's TabContext and TabList for navigation between different pages
 * like Activities, Saved, Profile, and About. It manages the current tab state and navigates
 * the user to the respective page upon tab change. Additionally, it handles user authentication
 * states for conditional navigation between the Login and Profile pages.
 *
 * @component
 * @example
 * <UpperBar />
 *
 * @returns {React.ReactElement} A Material UI Box component containing the navigation tabs
 * and the corresponding content of the selected tab.
 */

const UpperBar = () => {

  const location = useLocation();

  const [value, setValue] = useState('activities');
  const [, setPath] = useState('/');
  const [edit, setEdit] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate(); 

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);


  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    
   
    if(newValue !== 'activities'){
      setPath?.(newValue)
      navigate(`/${newValue}`);
      setEdit(false)
    }
    else{
      setPath?.("/")
      navigate(`/`);
    }
    
    setMessage("")
    setError(false)
  };

  useEffect(() => {
    const path = location.pathname.split('/')[1]; 
    switch (path) {
        case '':
            setValue('activities');
            break;
        case 'saved':
            setValue('saved');
            break;
        case 'registration':
        case 'login':
            setValue(FIREBASE_AUTH.currentUser ? 'profile' : 'registration');
            break;
        case 'profile':
            setValue('profile');
            break;
        case 'aboutPage':
            setValue('aboutPage');
            break;
        case 'messages':
            setValue('messages');
            break;
        default:
            break;
    }
  }, [location]);

  return (
    <Box sx={{ width: '100%', typography: 'body1', borderColor: 'divider'}}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider',backgroundColor: GOOD_WEATHER_COLORS.secondaryColor }}>
        <AnimatePresence>
          <TabList onChange={handleChange} aria-label={t('upperBar')} textColor="primary" centered>
            <Tab label={t('activities')} value="activities" />
            <Tab label={t('saved')} value="saved" />
            <Tab label={t('profile')} value={ FIREBASE_AUTH.currentUser ? "profile" : "registration"}/>
            <Tab label={t('about')} value={"aboutPage"}/>
            <Tab label={t('messages')} value={"messages"}/>
          </TabList>
        </AnimatePresence>
        </Box>
        <AnimatePresence>
          <Routes>
              <Route path="/" element={
                  <TabPanel value="activities">
                      <ActivitiesScreen setPath={setPath} setMessage={setMessage} setError={setError} message={message} error={error} />
                  </TabPanel>
              } />
              <Route path="/saved" element={
                  <TabPanel value="saved">
                      <SavePage setMessage={setMessage} setError={setError} message={message} error={error} />
                  </TabPanel>
              } />
              <Route path="/registration" element={
                  <TabPanel value="registration">
                      <RegistrationForm setMessage={setMessage} setError={setError} message={message} error={error} />
                  </TabPanel>
              } />
              <Route path="/login" element={
                  <TabPanel value="login">
                      <Login setMessage={setMessage} setError={setError} message={message} error={error} />
                  </TabPanel>
              } />
              <Route path="/profile" element={
                  <TabPanel value="profile">
                      <ProfilePage setEdit={setEdit} setPath={setPath} edit={edit} setMessage={setMessage} setError={setError} message={message} error={error} />
                  </TabPanel>
              } />
              <Route path="/aboutPage" element={
                  <TabPanel value="aboutPage">
                      <AboutPage />
                  </TabPanel>
              } />
              <Route path="/messages" element={
                  <TabPanel value="messages">
                      <MessagePage />
                  </TabPanel>
              } />
          </Routes>
      </AnimatePresence>
        <TabPanel value={ FIREBASE_AUTH.currentUser ? "profile" : "registration"}>
          <AnimatePresence>
            <Routes>
              <Route path="/registration" element={<RegistrationForm setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              <Route path="/login" element={<Login setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              {/* Define more routes as needed */}
            </Routes>
          </AnimatePresence>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default UpperBar