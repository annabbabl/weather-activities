import { useTranslation } from "react-i18next";
import { TypographyH2, TypographyH5, TypographyH6 } from "../components/components";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE } from "../firebase.config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { CandidateInformation, UserInformation, UserStatus } from "../types/databaseTypes";
import "../constants/i18next"
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Loading from "../components/shared/loadingScreen";
import { Avatar, Card, CardBody, CardHeader, ListItemPrefix, Typography } from "@material-tailwind/react";
import { EXPIRATION_DATE } from "../constants/constants";
import { checkDate } from "../utils/functions";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
  

const TimeLeftComponent = () => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [noTimeLeft, setNoTimeLeft] = useState(false);


    useEffect(() => {

        const updateTimeLeft = () => {
            const currentDate = new Date();
            const timeDifference = EXPIRATION_DATE.getTime() - currentDate.getTime();

            if (timeDifference <= 0) {
                setTimeLeft(t("timeIsUp"));
                setNoTimeLeft(true)
                return;
            }

            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimeLeft();
        const intervalId = setInterval(updateTimeLeft, 1000); // Update every second

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [t]);

    if(noTimeLeft){
        return <></>
    }

    return (
        <div className="flex flex-row items-center bg-white shadow-lg rounded-lg h-16 mb-12 w-1/3 ">
            <TypographyH5 text={t("timeLeft") + ": "} />
            <Typography variant={"h5"} placeholder={t("timeLeft")} textGradient className="ml-8 text-black ml-4">
                {timeLeft}
            </Typography>
            <AccessTimeFilledIcon fontSize="large" style={{marginLeft:2}} />
        </div>
    );
};

export const Analytics = () =>  {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [userStatus, setUserStatus] = useState<UserStatus>("user");
    const [users, setUsers] = useState<Array<UserInformation | null>>([]);
    const currentUserUid = FIREBASE_AUTH.currentUser?.uid
    const [winnerExists, setWinnerExists] = useState<boolean | undefined>();


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Votes per Candidate',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Votes'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Candidates'
                }
            }
        }
    };
    useEffect(() => {
        const determineUserType = async () => {
            setLoading(true)
            if(currentUserUid){
                const userDoc = doc(FIRESTORE, "users", currentUserUid)
                const userSnapshot = await getDoc(userDoc);
                if(userSnapshot.exists()){
                    const data = userSnapshot.data()
                    if(data.userStatus){
                        setUserStatus(data.userStatus)
                        setLoading(false)
                    }
                }
            }
        }

        const getUsers = async (): Promise<Array<UserInformation | null>> => {
            setLoading(true)
            const userCollection = collection(FIRESTORE, 'users');
            const userSnapshot = await getDocs(userCollection);
            const userList: Array<UserInformation | null> = await Promise.all(userSnapshot.docs.map(async (doc) => {
                const data = doc.data();
                if(data){
                    const candidateInformation: CandidateInformation = {
                        theses: [],
                        personalInformation: [],
                        avatarUrl: '',
                        description: '',
                        points: 0, 
                    };
                    if (data.userStatus === "candidate") {
                        const candidateInformationCollection = collection(FIRESTORE, `users/${doc.id}/candidate_information`);
                        const candidateInformationSnapshot = await getDocs(candidateInformationCollection);
                        
                        candidateInformationSnapshot.forEach(subDoc => {
                            const subData = subDoc.data();
                            console.log(subData, 222)

                            if (subData.theses) {
                                candidateInformation.theses?.push(...subData.theses);
                            }
                            if (subData.points) {
                                candidateInformation.points = subData.points;
                            }
                        });
                    }
                    const userObject: UserInformation = {
                        uid: data.uid,
                        displayName: data.displayName || '',
                        candidateInformation: candidateInformation,
                        elected: data.elected, 
                        userStatus: data.userStatus
                    }
                    return userObject
                }
                return null
                
            }))
            const filteredUsersList = userList.filter(user => user !== null);

            return filteredUsersList
        }
        determineUserType()
        const fetchData = async () => {
            const data = await getUsers(); 
            setUsers(data);
            setLoading(false)
        };
        fetchData();
        setWinnerExists(checkDate());

    }, [currentUserUid]);

    const numberOfParticipants = users.filter(user => user?.elected).length;
    const candidates = users.filter(user => user?.userStatus === "candidate");

    const candidateNames = candidates.map(candidate => candidate?.displayName);
    const candidatePoints = candidates.map(candidate => candidate?.candidateInformation?.points || 0);
    const totalPoints = candidatePoints.reduce((acc, points) => acc + points, 0);
    const candidatePercentages = candidatePoints.map(points => totalPoints ? (points / totalPoints * 100).toFixed(2) : 0);

    const electionData = {
        labels: candidateNames,
        datasets: [
            {
                label: t('votingPerc'),
                data: candidatePercentages,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    const winner: UserInformation | null = candidates
    .sort((a, b) => (b?.candidateInformation?.points || 0) - (a?.candidateInformation?.points || 0))[0];

    if(loading){
        return (<Loading/>)
    }
    return (
        <div className='flex flex-col justify-center h-screen items-center w-full'>
        <div className="mb-16 w-5/6 flex flex-col items-center justify-center">
            <TypographyH2 text={t("analytics")} />
            <TimeLeftComponent />
            {winnerExists && (
                <Card className="w-5/6 flex-row" placeholder={winner?.displayName} >
                    <CardBody placeholder={winner?.displayName}>
                        {winner?.candidateInformation && (
                            <div className='flex flex-row mb-8'>
                                <CardHeader floated={false} className="m-0 w-2/5 shrink-0 rounded-r-none" placeholder={t("candidateFoto")}>
                                <ListItemPrefix placeholder={winner?.displayName}>
                                    <TypographyH6 text={winner?.displayName} />
                                    <Avatar 
                                        variant="square" 
                                        alt={t("candidate")} 
                                        src={winner?.candidateInformation?.avatarUrl} 
                                        placeholder={"candidateFoto"}
                                        className='className="h-full w-full object-cover'
                                    />
                                </ListItemPrefix>
                            </CardHeader>
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}
            <div className="p-4 bg-white shadow-lg rounded-lg w-1/3 mt-4 flex flex-col items-center">
                <TypographyH5 text={t("participants")} />
                <div className="flex flex-col items-center mt-2">
                    <TypographyH6 text={t("peopleVoted") + ": " + numberOfParticipants} />
                    {userStatus === "admin" && (
                        <TypographyH6 text={t("peopleHaveRegisteredAndNotVoted") + ": " + (users.length - numberOfParticipants)} />
                    )}
                </div>
            </div>
            <div className="w-full h-96 mt-8">
                <Bar options={options} data={electionData} />
            </div>
            </div>
        </div>
    );
}
