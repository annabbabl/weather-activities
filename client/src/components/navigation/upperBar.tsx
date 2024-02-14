import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import '../../constants/i18next'
import { TabContext, TabList , TabPanel} from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { RegistrationForm } from '../../pages/registration';
import { Login } from '../../pages/login';
import ProfilePage from '../../pages/profile/profilePage';
import ActivitiesScreen from '../../pages/activities';
import { GOOD_WEATHER_COLORS } from '../../constants/theme';
import { User } from 'firebase/auth';
import AboutPage from '../../pages/aboutPage';


interface UpperBarProps {
  currentUser: User | undefined;
}


const UpperBar: React.FC<UpperBarProps> = ({ currentUser }) => {

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
            <Tab label={t('profile')} value={ currentUser ? "profile" : "registration"}/>
            <Tab label={t('about')} value={"aboutPage"}/>
          </TabList>
        </Box>
        <TabPanel value="activities">
          <ActivitiesScreen />
        </TabPanel>
        <TabPanel value="saved">{t('saved')}</TabPanel>
        <TabPanel value={ currentUser ? "profile" : "registration"}>
            <Routes>
              <Route path="/registration" element={<RegistrationForm setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              <Route path="/login" element={<Login setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              <Route path='/profile' element={<ProfilePage setEdit={setEdit} setPath={setPath} edit={edit} setMessage={setMessage} setError={setError} message={message} error={error}/>} />
              {/* Define more routes as needed */}
            </Routes>
        </TabPanel>
        <TabPanel value="aboutPage">
          <AboutPage/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default UpperBar