import { User } from "firebase/auth"
import { Timestamp } from "firebase-admin/firestore"; 

//custom type definitions

type UserEdit = {
    id? : string, 
    uid? : string, 
    email?: string, 
    password?: string, 
    username?: string, 
    displayName?: string, 
    created_at?: any, 
    loggedIn?: boolean
    profilePicture?: string,
    savedPosts?: Array<string>,
    allowedLocation?: boolean
}

type  Likes = {
    amount?: number, 
    likedUser?: Array<string>
}

type Weather = {
    formattedDate? : string | undefined, 
    weather?: any,
    temp?: any | undefined, 
    pressure?: float| number | undefined, 
    humidity?: float| number | undefined, 
    wind_speed?: float| number | undefined, 
    wind_deg?: float | number | undefined, 
    clouds?: float | number | undefined, 
    rain?: float | number | undefined, 
    startDate? : any |  Timestamp, 
    endDate? : any |  Timestamp , 
    day?: string | undefined, 
    date? : Timestamp | undefined
    feels_like? : any | undefined
}

type PostEdit = {
    id? : string, 
    createdBy?: string,
    endDate? : any, 
    city?: string, 
    weather?: Weather, 
    content?: string, 
    title?: string, 
    likes?: Likes, 
    createdFor? : string, 
    cretaedOn? : any, 
    userImage?: string | null | undefined, 
    username?: string | null | undefined, 
    userId?: string | null | undefined, 
}

type Post = {
    createdBy: string,
    created_at: any, 
    content: string, 
    title: string, 
    likes: number
}

export type {
    User,
    UserEdit, 
    Post, 
    PostEdit,
    Weather
}