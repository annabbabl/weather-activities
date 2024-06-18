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

export type {
    DefautlProps,
}