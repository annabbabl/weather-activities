import { Button, Card, Checkbox, List, ListItem } from "@material-tailwind/react";
import { t } from "i18next";
import { TypographyH2, TypographyH3, TypographyH5, TypographyH6 } from "../../components/components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import Loading from "react-loading";
import { FinalElement } from "../../components/finalStage";
import { checkDate } from "../../utils/functions";

function ElectionStart() {
    const navigate = useNavigate(); 
    const [checked, setChecked] = useState(false)
    const [elected, setElected] = useState(false)
    const [loading, setLoading] = useState(false);
    const [winnerExists, setWinnerExists] = useState<undefined | boolean>();


    useEffect(() => {
        const fetchElected = async () => {
            const currentUserID = FIREBASE_AUTH.currentUser?.uid
            if(currentUserID){
                setLoading(true)
                const userDoc = doc(FIRESTORE, 'users', currentUserID);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()){
                    const electedStatus = userSnapshot.data().elected
                    setElected(electedStatus)
                }
            }
        }
        setWinnerExists(checkDate());
        fetchElected()
        setLoading(false)
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='flex flex-col justify-between items-center h-screenlex flex-col justify-between h-screen w-full'>
            {!elected || !winnerExists ? (
                <><TypographyH2 text={'howDoesTheElectionWostartElectionHeader'} /><div className='flex flex-row items-center' style={{ textAlign: "center" }}>
                    <TypographyH5 text={'howDoesTheElectionWostartElectionText'} />
                </div><Card className="mt-6 w-2/3" placeholder={t("coreInformation")}>
                        <List placeholder={t("coreInformation")} className="ml-8">
                            <TypographyH3 text={t('beforeYoustartText')} />
                            <ListItem ripple={false} className="py-1 pr-1 pl-4" placeholder={t("rule1")}>
                                {t("rule1")}
                            </ListItem>
                            <ListItem ripple={false} className="py-1 pr-1 pl-4" placeholder={t("rule2")}>
                                {t("rule2")}
                            </ListItem>
                            <ListItem ripple={false} className="py-1 pr-1 pl-4" placeholder={t("rule3")}>
                                {t("rule3")}
                            </ListItem>
                        </List>
                        <div className="flex flex-row ml-10">
                            <TypographyH6 text={t('agree')} />
                            <Checkbox crossOrigin={undefined} onChange={() => setChecked(!checked)} />
                        </div>
                    </Card><Button
                        variant="gradient"
                        placeholder={t("begin")}
                        size="lg"
                        color="black"
                        onClick={() => navigate("/election/process")}
                        disabled={!checked}
                    >
                        {t("begin")}
                    </Button></>

            ): (
                <FinalElement text={winnerExists ? "youAlreadyVoted": "votingIsOver"} />
            )}
        </div>
    );
}

export default ElectionStart;
