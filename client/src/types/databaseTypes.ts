
type UserStatus = "user" | "admin" | "candidate";

type UserInformation = {
    uid?: string,
    userStatus?: UserStatus, 
    email?: string, 
    password?: string, 
    displayName: string, 
    candidateInformation?: CandidateInformation,
    elected?: boolean
}
type VotingOption = {
    candidateUID?: string,
    theses: Array<Thesis>;
}

type UserVote = {
    candidateUID?: string,
    round: number;
}

type CandidateInformation = {
    theses?: Array<Thesis>;
    description?: string,
    avatarUrl?: string, 
    personalInformation?: Array<PersonalInformation>;
    points?: number;
    winningStatus?: number;
};

type Thesis = {
    thesis: string, 
    opinion: string,
    solution?: string,
    plan?: string,
    tag: string
}
type PersonalInformation = {
    category: string, 
    information: string, 
}

export type {
    UserStatus, 
    UserInformation, 
    VotingOption,
    UserVote,
    CandidateInformation,
    Thesis,
    PersonalInformation
}

