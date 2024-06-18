
type UserInformation = {
    uid: string, 
    userStatus: "user" | "admin" | "candidate", 
    email?: string, 
    password?: string, 
    displayName?: string, 
    candidateInformation?: CandidateInformation, 
    elected?: boolean
}

type CandidateInformation ={
    theses: Array<Thesis>;
    description: string
    personalInformation: Array<PersonalInformation>;
    avatarUrl: string, 
    points?: number;
    winningStatus?: number;
};

type Thesis = {
    thesis: string, 
    opinion: string,
    solution?: string,
    plan?: string,
    tag?: string
}
type PersonalInformation = {
    category: string, 
    information: string, 
}
type VoteOccurrences = {
    candidateUID: string, 
    amount: number, 
}

export type {
    UserInformation, 
    CandidateInformation,
    Thesis,
    PersonalInformation, 
    VoteOccurrences
}