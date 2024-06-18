import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@material-tailwind/react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { TypographyH2, TypographyH5, TypographyH6 } from '../../components/components';
import { FIRESTORE } from '../../firebase.config';
import { CandidateInformation, UserInformation } from '../../types/databaseTypes';
import Loading from 'react-loading';

const CandidateDetail = () => {
  const { t } = useTranslation();
  const { uid } = useParams(); // Get the uid from URL parameters
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<UserInformation | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!uid) return;

      try {
        const candidateDoc = doc(FIRESTORE, 'users', uid);
        const candidateSnapshot = await getDoc(candidateDoc);

        if (candidateSnapshot.exists()) {
          const tempCandidate = candidateSnapshot.data() as UserInformation;

          // Fetch candidate information from subcollection
          const candidateInformationCollection = collection(FIRESTORE, `users/${uid}/candidate_information`);
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
            if (subData.avatarUrl) {
              candidateInformation.avatarUrl = subData.avatarUrl;
            }
          });

          tempCandidate.candidateInformation = candidateInformation;
          setCandidate(tempCandidate);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [uid]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col justify-between h-screen'>
      <TypographyH2 text={candidate?.displayName} />
      <div className="flex flex-wrap gap-2 mb-8">
        <Card className="w-full flex-row" placeholder={candidate?.displayName}>
          <CardBody placeholder={candidate?.displayName}>
            {candidate?.candidateInformation?.avatarUrl && (
              <div className='flex flex-col mb-8'>
              <CardHeader floated={false} className="w-full shrink-0 rounded-r-none" placeholder={t("candidateFoto")}>
                <div className='flex flex-row mb-8'>
                  <div className='flex flex-col w-2/5 '>
                    <TypographyH5 text={candidate?.displayName} />
                    <img
                      alt={candidate.displayName}
                      src={candidate.candidateInformation?.avatarUrl}
                      className='w-full'
                    />
                  </div>
                  <div className='flex flex-col w-2/5 ml-6 mt-4'>
                    <TypographyH5 text={"aboutText"} />
                    <TypographyH6 text={candidate.candidateInformation?.description} />
                  </div>
                </div>
              </CardHeader>
            </div>
            )}
            <div className='mt-5 mb-12'>
              {candidate?.candidateInformation?.personalInformation?.map((info, index) => (
                <div className="flex flex-row ml-2" key={index}>
                  <TypographyH6 text={info.category + ": "} />
                  <div className="ml-2" key={index}>
                    <TypographyH6 text={info.information} />
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-5 mb-12'>
              <div className='mb-2'>
                <TypographyH5 text={"theses"} />
              </div>
              {candidate?.candidateInformation?.theses?.map((thesis, index) => (
                <div className="flex flex-row ml-2" key={index}>
                  <TypographyH6 text={thesis.thesis + ": "} />
                  <div className="ml-2" key={index}>
                    <TypographyH6 text={thesis.opinion} />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CandidateDetail;
