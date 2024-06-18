import express, { Request, Response } from 'express';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.config';

export const electionRouter = express.Router();

function countOccurrences(votedCandidates: string[]): { [candidateUID: string]: number } {
    const occurrences: { [candidateUID: string]: number } = {};

    votedCandidates.forEach((candidateUID: string) => {
        if (occurrences[candidateUID]) {
            occurrences[candidateUID]++;
        } else {
            occurrences[candidateUID] = 1;
        }
    });

    return occurrences;
}


const receiveElection = async (req: Request, res: Response) => {
  const { currentUserUid, votedCandidates} = req.body;
  
  try {

    await FIRESTORE.collection('users').doc(currentUserUid).update({ elected: true });


    const countedVotedCandidates = countOccurrences(votedCandidates)
    for (const [candidateUID, newVotes] of Object.entries(countedVotedCandidates)) {
        console.log(`Candidate UID: ${candidateUID}, Votes: ${newVotes}`);
        
        // Retrieve existing candidate information
        const candidateDocRef = FIRESTORE.collection('users').doc(candidateUID);
        const candidateDocSnapshot = await candidateDocRef.get();
        
        if (candidateDocSnapshot.exists) {
            const candidateInformationCollectionRef = candidateDocRef.collection('candidate_information');
            const candidateInformationSnapshot = await candidateInformationCollectionRef.get();

            if (!candidateInformationSnapshot.empty) {
                const firstDoc = candidateInformationSnapshot.docs[0];
                const existingVotes = firstDoc.data().points || 0;
                const updatedVotes = existingVotes + newVotes;

                await candidateInformationCollectionRef.doc(firstDoc.id).update({ points: updatedVotes });

                console.log(`Updated votes for candidate UID: ${candidateUID} to ${updatedVotes}`);
            } else {
                console.error(`No documents in the candidate_information subcollection for candidate UID: ${candidateUID}`);
            }
        } else {
            console.error(`No such document for candidate UID: ${candidateUID}`);
        }
    }
    res.status(200).json({
        success: true,
        message: 'User election status and votes updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating election status:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

electionRouter.post('/finishElection', (req, res) => receiveElection(req, res));

export default electionRouter;
