import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import '../../constants/i18next.ts'
import { TabContext, TabList , TabPanel} from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { RegistrationForm } from '../registration.tsx';
import { Login } from '../login.tsx';
import ProfilePage from '../profile/profilePage.tsx';
import ActivitiesScreen from '../activities.tsx';
import { GOOD_WEATHER_COLORS } from '../../constants/theme.ts';
import { FIREBASE_AUTH } from '../../api/firebase/firebase.config.ts';


export default function UpperBar() {
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

  return (
    <Box sx={{ width: '100%', typography: 'body1', borderColor: 'divider'}}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider',backgroundColor: GOOD_WEATHER_COLORS.secondaryColor }}>
          <TabList onChange={handleChange} aria-label={t('upperBar')} textColor="primary" centered>
            <Tab label={t('activities')} value="activities" />
            <Tab label={t('saved')} value="saved" />
            <Tab label={t('profile')} value={ FIREBASE_AUTH.currentUser ? "profile" : "registration"}/>
          </TabList>
        </Box>
        <TabPanel value="activities">
          <ActivitiesScreen />
        </TabPanel>
        <TabPanel value="saved">{t('saved')}</TabPanel>
        <TabPanel value={ FIREBASE_AUTH.currentUser ? "profile" : "registration"}>
            <Routes>
              <Route path="/registration" element={<RegistrationForm setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              <Route path="/login" element={<Login setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              <Route path="/" element={<div>home</div>} />
              <Route path="/profile" element={<ProfilePage setEdit={setEdit} edit={edit} setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              {/* Define more routes as needed */}
            </Routes>
        </TabPanel>
      </TabContext>
    </Box>
  );
}