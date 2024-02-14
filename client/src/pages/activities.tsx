import { TabContext, TabList  } from '@mui/lab';
import Tab from '@mui/material/Tab';
import '../constants/i18next'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';



export default function ActivitiesScreen() {
    const [day, setDay] = useState('Monday');
    const { t } = useTranslation();
    
    const handleChange = (_event: React.SyntheticEvent, newDay: string) => {
        setDay(newDay);
    };
    
    return (
        <div className='flex flex-col w-full items-center justify-center h-5/6 mt-28'>
            <TabContext value={day}>
                <div className="border-b-2 w-5/6 bg-yellow-400 rounded-md text-blue-700 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] ">
                    <TabList onChange={handleChange} aria-label={t('upperBar')} textColor="inherit" centered >
                        <div className={`border-r-2 border-yellow-500 hover:bg-blue-700 hover:text-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ${day === 'monday' ? 'bg-blue-700 text-white vigorous ' : ''}`} onClick={() => setDay('Monday')}>
                            <Tab label={t('monday')} value={'Monday'} />
                        </div>
                        <div className={`border-r-2 border-yellow-500 hover:bg-blue-700 hover:text-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ${day === 'tuesday' ? 'bg-blue-700 text-white vigorous' : ''}`} onClick={() => setDay('Tuesday')}>
                            <Tab label={t('tuesday')} value={'Tuesday'} />
                        </div>
                        <div className={`border-r-2 border-yellow-500 hover:bg-blue-700 hover:text-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ${day === 'wensday' ? 'bg-blue-700 text-white vigorous' : ''}`} onClick={() => setDay('Wensday')}>
                            <Tab label={t('wensday')} value={'Wensday'} />
                        </div>
                        <div className={`border-r-2 border-yellow-500 hover:bg-blue-700 hover:text-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ${day === 'thursday' ? 'bg-blue-700 text-white' : ''}`} onClick={() => setDay('Thursday')}>
                            <Tab label={t('thursday')} value={'Thursday'} />
                        </div>
                        <div className={`border-r-2 border-yellow-500 hover:bg-blue-700 hover:text-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ${day === 'friday' ? 'bg-blue-700 text-white' : ''}`} onClick={() => setDay('Friday')}>
                            <Tab label={t('friday')} value={'Friday'} />
                        </div>
                        <div className={`border-r-2 border-yellow-500 hover:bg-blue-700 hover:text-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] ${day === 'saturday' ? 'bg-blue-700 text-white' : ''}`} onClick={() => setDay('Saturday')}>
                            <Tab label={t('saturday')} value={'Saturday'} />
                        </div>
                        <div className={`hover:bg-blue-700 hover:text-white ${day === 'sunday' ? 'bg-blue-700 text-white' : ''}`} onClick={() => setDay('Sunday')}>
                            <Tab label={t('sunday')} value={'Sunday'} />
                        </div>
                    </TabList>
                </div>
            </TabContext>
            <div
                className="w-5/6 h-4/5 rounded-md flex  justify-center items-center p-10 bg-blue-800/[.2] shadow-[rgba(40,_38,_76,_0.19)_0px_9px_20px] "
            >
                <div>
                    <div
                        className="w-full rounded-md flex justify-center items-center p-5 bg-blue-800 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] "
                    >
                        {day}
                    </div>    
                </div>       
            </div>
        </div>
    );
}
