import { Weather } from "./databaseTypes";

export default async function weatherFetching(latitude: string, longitude: string): Promise<any> {
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,hourly,minutely,alerts&units=metric&appid=${process.env.WEATHERAPI_KEY}`;

    const getNextSevenDays = () =>  {
        const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today: number = new Date().getDay(); 
        const nextSevenDays: string[] = [];
    
        for (let i = 0; i < 8; i++) {
            const nextDayIndex: number = (today + i) % 7; 
            nextSevenDays.push(days[nextDayIndex]);
        }
    
        return nextSevenDays;
    }

    const getNextSevenDates = () => {
        const today: Date = new Date();
        const nextSevenDays: Date[] = [];

        for (let i = 0; i < 7; i++) {
            const nextDay: Date = new Date(today);
            nextDay.setDate(today.getDate() + i);
            nextSevenDays.push(nextDay);
        }

        return nextSevenDays;
    };

    const nextSevenDays: string[] = getNextSevenDays();
    const nextSevenDates: Date[] = getNextSevenDates();

    try {
        const response = await fetch(WEATHER_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data for ${(longitude + " " + longitude)}`);
        }
        
        const weather = await response.json();
        const daily = weather.daily;

        const formattedData = daily.slice(0, 7).map((day: any, index: number) => {
            const formattedDay: any = {};

            if (day.temp) {
                formattedDay.temp = {
                    day: day.temp.day,
                    min: day.temp.min,
                    max: day.temp.max,
                    night: day.temp.night,
                    eve: day.temp.eve,
                    morn: day.temp.morn
                };
            }
            const date = nextSevenDates[index];

            const formattedDate = [
                ('0' + date.getDate()).slice(-2),
                ('0' + (date.getMonth() + 1)).slice(-2),
                date.getFullYear() 
            ].join('-');

            formattedDay.date = formattedDate;


            if (day.feels_like) {
                formattedDay.feels_like = {
                    day: day.feels_like.day,
                    night: day.feels_like.night,
                    eve: day.feels_like.eve,
                    morn: day.feels_like.morn
                };
            }

            if (day.pressure) {
                formattedDay.pressure = day.pressure;
            }

            if (day.humidity) {
                formattedDay.humidity = day.humidity;
            }

            if (day.wind_speed) {
                formattedDay.wind_speed = day.wind_speed;
            }

            if (day.wind_deg) {
                formattedDay.wind_deg = day.wind_deg;
            }

            if (day.weather) {
                formattedDay.weather = day.weather;
            }

            if (day.clouds) {
                formattedDay.clouds = day.clouds;
            }

            if (day.rain) {
                formattedDay.rain = day.rain;
            }
            if (nextSevenDays[index]) {
                formattedDay.day = nextSevenDays[index]
            }

            formattedDay.creationDate = nextSevenDays[index] 

            
            return formattedDay;
        });

        return formattedData;
    } catch (error: any) {
        console.error('Error:', error.message);
        throw error;
    }
};
