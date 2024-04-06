
//custom type definitions

type WeatherPlace = {
    weather: Array<any>,
    temp: Array<any> |undefined, 
    pressure: float| number | undefined, 
    humidity: float| number | undefined, 
    wind_speed: float| number | undefined, 
    wind_deg: float | number | undefined, 
    clouds: float | number | undefined, 
    rain: float | number | undefined, 
    startDate? : any, 
    endDate? : any, 
    day: string
}

type Post = {
    createdBy: string,
    created_at: any, 
    content: string, 
    title: string, 
    likes: number
}
type PostEdit = {
    id? : string, 
    text? : string, 
    createdBy?: string,
    city?: string, 
    weather?: Weather, 
    content?: string, 
    title?: string, 
    likes?: Like, 
    img?: string,
    createdFor? : any, 
    cretaedOn? : any, 
    userImage?: string | null | undefined, 
    username?: string | null | undefined, 
    userId?: string | null | undefined, 
}

type Like = {
    amount?: number, 
    likedUser?: Array<string>
}

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

type Weather = {
    formattedDate?: string | undefined,
    weather?: any,
    temp?: any | undefined, 
    pressure?: float| number | undefined, 
    humidity?: float| number | undefined, 
    wind_speed?: float| number | undefined, 
    wind_deg?: float | number | undefined, 
    clouds?: float | number | undefined, 
    rain?: float | number | undefined, 
    creationDate?: Date, 
    day?: string, 
    date? : Date
}

export type {
    UserEdit, 
    Post, 
    PostEdit,
    WeatherPlace, 
    Weather,
    Like as Likes
}