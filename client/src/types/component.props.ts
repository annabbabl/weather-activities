interface DefautlProps  {
    loggedIn?: boolean
    setLoggedIn?: React.Dispatch<React.SetStateAction<boolean>>;
    path?: string, 
    setPath?: React.Dispatch<React.SetStateAction<string>>;
    setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage?: React.Dispatch<React.SetStateAction<string>>;
    setError?: React.Dispatch<React.SetStateAction<boolean>>;
    edit?: boolean, 
    message?: string,
    error?: boolean, 

}

interface AuthProps extends DefautlProps {
    username?: string, 
    password?: string,
    email?: string,
    imgUrl? : string,
    setEmail?: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setPassword?: React.Dispatch<React.SetStateAction<string>>;
    setUsername?: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setPath?: React.Dispatch<React.SetStateAction<string>>;
   
}

export type {
    DefautlProps,
    AuthProps
}