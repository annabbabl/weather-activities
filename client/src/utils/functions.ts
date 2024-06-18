import { EXPIRATION_DATE } from "../constants/constants";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE } from "../firebase.config";
import { CandidateInformation, UserInformation } from "../types/databaseTypes";

export const checkDate = ():boolean => {
    const currentDate = new Date();
    console.log(currentDate)

    // Reset time part for comparison
    const targetDateStr = EXPIRATION_DATE.toISOString().split('T')[0];
    const currentDateStr = currentDate.toISOString().split('T')[0];

    
    return currentDateStr === targetDateStr ? true: false;
};