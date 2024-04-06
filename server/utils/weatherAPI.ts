

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

import { Timestamp } from "firebase-admin/firestore"; 
import { Weather } from "./databaseTypes";

export default async function weatherFetching(latitude: string, longitude: string): Promise<any> {
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,hourly,minutely,alerts&units=metric&appid=92c03da4015b2366672cea996f36767f`;

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
        const nextSevenDates: any[] = []; 

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(); 
            nextDay.setDate(nextDay.getDate() + i); 
            nextDay.setHours(0, 0, 0, 0); 
            nextSevenDates.push(nextDay); 
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

        const formattedData: Array<Weather> = daily.slice(0, 7).map((day: any, index: number) => {
            const formattedDay: Weather = {};
            const timestamp = Timestamp.fromDate(nextSevenDates[index]); 

            if (day.temp !== undefined ) formattedDay.temp = day.temp;; 
            if (day.temp !== undefined ) formattedDay.temp = day.temp;
            if (timestamp !== undefined) formattedDay.date = timestamp;
            if (timestamp !== undefined) formattedDay.formattedDate = timestamp.toDate().toDateString();
            if (day.feels_like !== undefined) formattedDay.feels_like = day.feels_like;
            if (day.pressure !== undefined) formattedDay.pressure = day.pressure;
            if (day.humidity !== undefined) formattedDay.humidity = day.humidity;
            if (day.wind_speed !== undefined) formattedDay.wind_speed = day.wind_speed;
            if (day.wind_deg !== undefined) formattedDay.wind_deg = day.wind_deg;
            if (day.weather !== undefined) formattedDay.weather = day.weather;
            if (day.clouds !== undefined) formattedDay.clouds = day.clouds;
            if (day.rain !== undefined) formattedDay.rain = day.rain;
            if (nextSevenDays[index] !== undefined) formattedDay.day = nextSevenDays[index]

            return formattedDay;
        });
        return formattedData;
    } catch (error: any) {
        console.error('Error:', error.message);
        throw error;
    }
};