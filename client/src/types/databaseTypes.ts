

type User = {
    id? : string, 
    email: string, 
    password: string, 
    username: string, 
    created_at: any, 
    loggedIn: boolean
}
type UserEdit = {
    id? : string, 
    email?: string, 
    password?: string, 
    username?: string, 
    created_at?: any, 
    loggedIn?: boolean
    profilePicture?: string,
    posts?: Array<PostEdit>
}


type PostEdit = {
    id? : string, 
    createdBy?: string,
    created_at?: any, 
    content?: string, 
    title?: string, 
    likes?: number
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
    PostEdit
}