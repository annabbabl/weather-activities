import { Accordion, AccordionBody, AccordionHeader, Button, IconButton } from "@material-tailwind/react";
import { TypographyH2 } from "../../components/components";
import "../../constants/i18next";
import { useNavigate } from "react-router-dom";
import { CandidateInformation, VotingOption, UserVote } from "../../types/databaseTypes";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE } from "../../firebase.config";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RadioButtonChecked, RadioButtonUnchecked, Check } from '@mui/icons-material';
import Loading from "react-loading";

const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
};

function ElectionProcess() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [votingOptions, setVotingOptions] = useState<Array<VotingOption | null>>([]);
    const [round, setRound] = useState(0);
    const [open, setOpen] = useState(0);
    const [submitVotesButtonDisabled, setSubmitVotesButtonDisabled] = useState(true);
    const [votes, setVotes] = useState<Array<UserVote>>([]);

    const setElectionResult = async (): Promise<Array<VotingOption | null>> => {
        try {
            const candidatesCollection = collection(FIRESTORE, 'users');
            const candidatesSnapshot = await getDocs(candidatesCollection);

            const votingOptionList: Array<VotingOption | null> = await Promise.all(candidatesSnapshot.docs.map(async (doc) => {
                const data = doc.data();
                if (data.userStatus === "candidate") {
                    const candidateInformationCollection = collection(FIRESTORE, `users/${doc.id}/candidate_information`);
                    const candidateInformationSnapshot = await getDocs(candidateInformationCollection);
                    const candidateInformation: CandidateInformation = {
                        theses: [],
                        personalInformation: [],
                        avatarUrl: '',
                        description: ''
                    };

                    candidateInformationSnapshot.forEach(subDoc => {
                        const subData = subDoc.data();
                        if (subData.theses) {
                            candidateInformation.theses?.push(...subData.theses);
                        }
                    });
                    const votingOptionObject: VotingOption = {
                        candidateUID: doc.id,
                        theses: candidateInformation.theses ? candidateInformation.theses : [],
                    }

                    return votingOptionObject;
                }
                return null;
            }));

            return votingOptionList.filter(option => option !== null) as Array<VotingOption>;

        } catch (error) {
            console.error("Error fetching candidates:", error);
            throw error;
        }
    };

    const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

    const handleVote = (votedCandidateUID: string | undefined) => {
        if (votedCandidateUID) {
            const newVote: UserVote = {
                candidateUID: votedCandidateUID,
                round: round
            };
            const roundExists = votes.some(vote => vote.round === round);

            if (!roundExists) {
                setVotes(prevVotes => [...prevVotes, newVote]);
            } else {
                const updatedVotes = votes.map(vote =>
                    vote.round === round ? { ...vote, candidateUID: votedCandidateUID } : vote
                );
                setVotes(updatedVotes);
            }
        }
        if(votingOptions[0]?.theses.length && round < votingOptions[0]?.theses.length-1){
            console.log(round, votingOptions[0]?.theses.length)
            setRound(round + 1)
        }else{
            setSubmitVotesButtonDisabled(false)
        }
    };

    const handleSubmitVotes = async () => {
        setLoading(true);

        const amountOfVotedCandidates: number = votes.filter(vote => vote.candidateUID && vote.candidateUID !== "").length;

        if (votingOptions[0]?.theses.length !== amountOfVotedCandidates) {
            const rounds = votingOptions[0]?.theses.map((_thesis, index) => index);
            const missingRound = rounds?.find(round => !votes.some(vote => vote.round === round));

            if (missingRound !== undefined) {
                setRound(missingRound);
            }

        } else {
            try {
                const currentUserUid = FIREBASE_AUTH.currentUser?.uid;
                const votedCandidates = votes.map(vote => vote.candidateUID);
                const sendObject = {
                    currentUserUid: currentUserUid,
                    votedCandidates: votedCandidates
                };

                const response = await fetch('http://localhost:3001/election/finishElection', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sendObject),
                });

                if (!response.ok) {
                    throw new Error('Voting failed');
                }

                const data = await response.json();
                console.log('Voting successful', data);

                navigate(`/election/finishElection`);
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
                setRound(0);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await setElectionResult();
            setVotingOptions(data);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }
    console.log(votes, round,  111)

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <div className='items-center w-2/3'>
                <TypographyH2 text={votingOptions[0]?.theses[round].tag} />
                {votingOptions.map((votingOption, index) => (
                    <div key={index}>
                        <Accordion
                            open={open === index}
                            icon={<Check />}
                            placeholder={votingOption?.theses[round].opinion}
                            animate={CUSTOM_ANIMATION}
                        >
                            <AccordionHeader onClick={() => handleOpen(1)} placeholder={votingOption?.theses[round].opinion}>
                                {votingOption?.theses[round].thesis}
                            </AccordionHeader>
                            <AccordionBody>
                                {votingOption?.theses[round].opinion}
                                <Button
                                    className="mt-5 bg-black text-white w-full"
                                    placeholder={votingOption?.theses[round].opinion}
                                    onClick={() => handleVote(votingOption?.candidateUID)}
                                >
                                    {votingOption?.theses[round].opinion}
                                </Button>
                            </AccordionBody>
                        </Accordion>
                    </div>
                ))}
            </div>
            <div className='flex items-center mt-8'>
                {votingOptions[0]?.theses.length && round === votingOptions[0]?.theses.length-1 && (
                    <Button
                        className="mt-5 bg-black text-white w-full"
                        placeholder={t("submitVotes")}
                        disabled={submitVotesButtonDisabled}
                        onClick={handleSubmitVotes}
                    >
                        {t("submitVotes")}
                    </Button>
                )}
            </div>
            <div className='flex items-center mt-8'>
                {votingOptions[0]?.theses.map((_theses, index) => (
                    <IconButton
                        className="ml-2 text-black"
                        size='sm'
                        placeholder={t('selectRound')}
                        variant="text"
                        key={index}
                        onClick={() => setRound(index)}
                    >
                        {index === round ? (
                            <RadioButtonChecked fontSize='small' />
                        ) : (
                            <RadioButtonUnchecked fontSize='small' />
                        )}
                    </IconButton>
                ))}
            </div>
        </div>
    );
}

export default ElectionProcess;
