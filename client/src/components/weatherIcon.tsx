import "../constants/i18next"
import 'react-quill/dist/quill.snow.css'; 
import {AcUnit, WbSunny, Cloud, Thunderstorm} from '@mui/icons-material/';
import { FaCloudRain } from "react-icons/fa6";
import { RiMistFill } from "react-icons/ri";



interface WeatherIconAttributes {
    weatherDescription: any
}

export default function WeatherIcon({weatherDescription}: WeatherIconAttributes) {
    const strWeatherDescription = String(weatherDescription)

    return (
        <>
           {strWeatherDescription.includes('snow') ? (
                <AcUnit fontSize="small" htmlColor="white"/>
           ): weatherDescription.includes('clear Sky') ?(
                <WbSunny fontSize="small" htmlColor="white"/>
           ): weatherDescription.includes('clouds') ?(
                <Cloud fontSize="small" htmlColor="white"/>
           ): weatherDescription.includes('thunderstorm') || weatherDescription.includes('tornado') ? (
                <Thunderstorm fontSize="small" htmlColor="white"/>
           ): weatherDescription.includes('rain') || weatherDescription.includes('drizzle')? (
                <FaCloudRain size={"10px"} color={'white'}/>
           ): weatherDescription.includes('mist') || weatherDescription.includes('smoke') 
                    || weatherDescription.includes('dust') 
                    || weatherDescription.includes('fog')
                    || weatherDescription.includes('haze')
                    || weatherDescription.includes('squalls')
                    || weatherDescription.includes('ash')
                    || weatherDescription.includes('sand')? (
                <RiMistFill color={'white'} size={"10px"} fontSize={"10px"} />
            ): (
                <></>
            )}
        </>
    )}
