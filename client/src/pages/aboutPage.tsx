import {
    Typography,
    List,
    ListItem,
    ListItemSuffix,
    Card,
    Button
} from "@material-tailwind/react";
import '../constants/i18next';
import { useTranslation } from "react-i18next";
import { StandartBlueWave } from "../components/shared/waves";
import { ParallaxProvider } from 'react-scroll-parallax';
import { DateRange, MyLocation } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { TypographyH2, TypographyH3, TypographyParagraph } from "../components/components";
import Loading from "react-loading";
import { checkDate } from "../utils/functions";
import { FinalElement } from "../components/finalStage";

export default function Homepage() {
    const { t } = useTranslation();
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [winnerExists, setWinnerExists] = useState<boolean | undefined>();

    const [loggedIn, setLoggedIn] = useState(false);
    const logginOrStartTxt = !loggedIn ? "loginOrRegister" : "startNow";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
            setLoading(false); // Set loading to false after user state is checked
        });

        setWinnerExists(checkDate());

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='flex flex-col justify-between h-screen'>
            {!winnerExists ? (
                <>
                    <div className='mt-12 mb-5 w-full flex flex-col px-8'>
                        <div className="flex flex-col items-center w-full mb-8">
                            <Typography className="text-leftblue-700 text-left8xl font-extrabold text-left" variant="h1" placeholder={t('username')}>
                                {t('electYourFuture')}
                            </Typography>
                        </div>
                        <ParallaxProvider>
                            <TypographyParagraph text='electionText' />
                            <div className="flex flex-col items-center w-full mt-6">
                                <Card className="flex flex-col items-center w-96 mt-6 ml-6" placeholder={t("coreInformation")}>
                                    <List placeholder={t("coreInformation")} className="ml-6">
                                        <ListItem ripple={false} className="py-1 pr-1 pl-4 " placeholder={t("electionDate")}>
                                            <TypographyH3 text={'coreInformation'} />
                                        </ListItem>
                                        <ListItem ripple={false} className="py-1 pr-1 pl-4" placeholder={t("electionDate")}>
                                            {t("electionDate")}
                                            <ListItemSuffix placeholder={undefined}>
                                                <DateRange />
                                            </ListItemSuffix>
                                        </ListItem>
                                        <ListItem ripple={false} className="py-1 pr-1 pl-4" placeholder={t("where")}>
                                            {t("where")}
                                            <ListItemSuffix placeholder={undefined}>
                                                <MyLocation />
                                            </ListItemSuffix>
                                        </ListItem>
                                    </List>
                                </Card>
                            </div>
                            <TypographyH3 text={'howDoesTheElectionWorkHeader'} />
                            <TypographyParagraph text='howDoesTheElectionWork' />
                            <TypographyH3 text={'electionProcedureHeader'} />
                            <ul>
                                <li>
                                    <TypographyParagraph text='electionProcedure1' />
                                </li>
                                <li>
                                    <TypographyParagraph text='electionProcedure2' />
                                </li>
                                <li>
                                    <TypographyParagraph text='electionProcedure3' />
                                </li>
                            </ul>
                            <TypographyH3 text={'electionAdvantagesHeader'} />
                            <ul>
                                <li>
                                    <TypographyParagraph text='electionAdvantages1' />
                                </li>
                                <li>
                                    <TypographyParagraph text='electionAdvantages2' />
                                </li>
                                <li>
                                    <TypographyParagraph text='electionAdvantages3' />
                                </li>
                            </ul>
                        </ParallaxProvider>
                        <div className="mb-12 mt-8 flex flex-col items-center w-full mb-8">
                            <TypographyH2 text={logginOrStartTxt} />
                            <TypographyParagraph text='participationAlert' />
                            <Button 
                                variant="gradient"
                                placeholder={t(logginOrStartTxt)} 
                                size="lg"
                                color="blue"
                                onClick={() =>{logginOrStartTxt ==="startNow" ? navigate("/startElection") : navigate("/login")}}
                            >
                                {t(logginOrStartTxt)}
                            </Button>
                        </div>
                    </div>
                    <div className="w-full mt-auto">
                        <StandartBlueWave />
                    </div>
                </>
            ) : (
                <div>
                    <FinalElement text={"votingIsOver"} link={"/analytics"} />
                    
                </div>
            )}
        </div>
    );
}
