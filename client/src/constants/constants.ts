import { MenuBarIten } from "./types";

const THESIS_TAGS = {
    climateChange: "climateChange", 
    socialIssues: "socialIssues", 
    rent: "rent", 
    infrastructure: "infrastructure", 
    migration: "migration", 
    foreignPolicy: "Foreign Policy", 
    school: "school", 
    monetary: "monetary", 
    taxes: "taxes", 
    bubatz: "bubatz", 
    doenerPreisBremse: "doenerPreisBremse", 
};


const MENU_ITEMS: Array<MenuBarIten> = [
    {
        i18Key: "homepage", 
        link: '/'
    }, 
    {
        i18Key: "frequentQuestions", 
        link: '/faq'
    }, 
    {
        i18Key: "candidates", 
        link: '/candidates'
    }, 
    {
        i18Key: "election", 
        link: '/election/startElection'
    }, 
    {
        i18Key: "analytics", 
        link: '/analytics'
    }, 
]
const EXPIRATION_DATE = new Date('2024-06-19')
export {
    THESIS_TAGS, 
    MENU_ITEMS, 
    EXPIRATION_DATE
}