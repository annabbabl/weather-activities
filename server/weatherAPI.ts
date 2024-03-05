import { Timestamp } from "firebase/firestore";


/**
 * Asynchronous function to fetch the next seven days' weather data based on latitude and longitude.
 * It constructs the API URL for fetching weather from OpenWeatherMap and processes the response
 * to format it for use in the application. It utilizes Firestore's Timestamp for date handling
 * and provides weather information including temperature, humidity, wind speed, and more for each day.
 *
 * @async
 * @function weatherFetching
 * @param {string} latitude - The latitude coordinate for the location.
 * @param {string} longitude - The longitude coordinate for the location.
 * @returns {Promise<any>} A promise that resolves with the formatted weather data for the next seven days.
 * Each day's weather information includes temperature, feels_like, pressure, humidity, wind speed, wind_deg, 
 * weather description, clouds, potential rain, the day of the week, and the Firestore Timestamp for that date.
 *
 * @example
 * const weatherData = await weatherFetching('52.5200', '13.4050');
 * console.log(weatherData);
 *
 * @throws {Error} Throws an error if the weather data could not be fetched or processed.
 */

export default async function weatherFetching(latitude: string, longitude: string): Promise<any> {
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,hourly,minutely,alerts&units=metric&appid=${process.env.WEATHERAPI_KEY}`;

    const getNextSevenDays = () =>  {
        const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today: number = new Date().getDay(); 
        const nextSevenDays: string[] = [];
    
        for (let i = 0; i < 7; i++) { // Should only loop 7 times for the next seven days
            const nextDayIndex: number = (today + i) % 7; 
            nextSevenDays.push(days[nextDayIndex]);
        }
    
        return nextSevenDays;
    }

    const getNextSevenDates = () => {
        const nextSevenDates: Timestamp[] = []; // Change to use Firestore Timestamp

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(); // Get today's date
            nextDay.setDate(nextDay.getDate() + i); // Set to next day in the loop
            nextDay.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for consistency
            nextSevenDates.push(Timestamp.fromDate(nextDay)); // Convert to Firestore Timestamp
        }

        return nextSevenDates;
    };

    const nextSevenDays = getNextSevenDays();
    const nextSevenDates = getNextSevenDates();

    try {
        const response = await fetch(WEATHER_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data for ${latitude}, ${longitude}`);
        }
        
        const weather = await response.json();
        const daily = weather.daily;

        const formattedData = daily.slice(0, 7).map((day: any, index: number) => {
            const formattedDay: any = {};

            if (day.temp) {
                formattedDay.temp = day.temp;
            }

            const timestamp = nextSevenDates[index]; // Get Firestore Timestamp
            formattedDay.date = timestamp;

            // Assign other day properties as before
            formattedDay.feels_like = day.feels_like;
            formattedDay.pressure = day.pressure;
            formattedDay.humidity = day.humidity;
            formattedDay.wind_speed = day.wind_speed;
            formattedDay.wind_deg = day.wind_deg;
            formattedDay.weather = day.weather;
            formattedDay.clouds = day.clouds;
            formattedDay.rain = day.rain;
            formattedDay.day = nextSevenDays[index]; // Day of the week
            formattedDay.creationDate = timestamp; // Store as Firestore Timestamp

            return formattedDay;
        });

        return formattedData;
    } catch (error: any) {
        console.error('Error:', error.message);
        throw error;
    }
};