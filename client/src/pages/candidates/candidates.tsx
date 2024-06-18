import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemPrefix, Avatar, Card, CardBody, CardHeader, CardFooter } from '@material-tailwind/react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { TypographyH2, TypographyH5, TypographyH6 } from '../../components/components';
import { FIRESTORE } from '../../firebase.config';
import { UserInformation, CandidateInformation } from '../../types/databaseTypes';

const Candidates = () => {
  const { t } = useTranslation();
  const [candidates, setCandidates] = useState<Array<UserInformation | null>>([]);

  const getCandidates = async (): Promise<Array<UserInformation | null>> => {
    try { 
      const candidatesCollection = collection(FIRESTORE, 'users');
      const candidatesSnapshot = await getDocs(candidatesCollection);
      
      const candidatesList: Array<UserInformation | null> = await Promise.all(candidatesSnapshot.docs.map(async (doc) => {
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
            if (subData.personalInformation) {
              candidateInformation.personalInformation?.push(...subData.personalInformation);
            }
          });
          const candidateObject: UserInformation = {
            uid: data.uid,
            displayName: data.displayName || '',
            userStatus: data.userStatus,
            candidateInformation: candidateInformation,
          }
  
          return candidateObject
        }
        return null;
      }));
  
      const filteredCandidatesList = candidatesList.filter(candidate => candidate !== null);
  
      return filteredCandidatesList;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCandidates(); 
      setCandidates(data);
    };
    fetchData();
  }, []);

  return (
    <div className='flex flex-col justify-between h-screen'>
      <TypographyH2 text={t("candidates")} />
      <TypographyH5 text={'candidatesText'} />
      <div className="flex flex-wrap gap-2 mb-8">
        <List placeholder={t("candidates")}>
          {candidates.map(candidate => (
            <ListItem key={candidate?.uid} placeholder={candidate?.displayName} style={{width:"300%"}}>
                <Card className="w-5/6 flex-row" placeholder={candidate?.displayName} >
                    <CardBody placeholder={candidate?.displayName}>
                        {candidate?.candidateInformation && (
                            <div className='flex flex-row mb-8'>
                                <CardHeader floated={false} className="m-0 w-2/5 shrink-0 rounded-r-none" placeholder={t("candidateFoto")}>
                                <ListItemPrefix placeholder={candidate?.displayName}>
                                    <TypographyH6 text={candidate?.displayName} />
                                    <Avatar 
                                      variant="square" 
                                      alt={t("candidate")} 
                                      src={candidate?.candidateInformation?.avatarUrl} 
                                      placeholder={"candidateFoto"}
                                      className='className="h-full w-full object-cover'
                                    />
                                </ListItemPrefix>
                            </CardHeader>
                            </div>
                        )}
                        <div className='mt-5 mb-12'>
                            <div className='mb-2'>
                                <TypographyH5 text={"aboutText"} />
                            </div>
                            {candidate?.candidateInformation?.personalInformation?.map((info, index) =>(
                                <div className="flex flex-row ml-2" key={index}>
                                    <TypographyH6 text={info.category+ ": "} />
                                    <div className="ml-2" key={index}>
                                        <TypographyH6 text={info.information}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <CardFooter className="pt-0 " placeholder={t('wannaKnowMore')}>
                            <Link to={`/candidate/${candidate?.uid}`} className="text-blue-600 hover:text-blue-800" >
                              {t('wannaKnowMore')+ candidate?.displayName + t('erfahren')}
                            </Link>
                        </CardFooter>
                    </CardBody>
                </Card>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default Candidates;
