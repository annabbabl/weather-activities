import express, { Request, Response } from 'express';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.config';
import { CandidateInformation, UserInformation } from '../utils/databaseTypes';

export const registrationRouter = express.Router();

const registerUser = async (req: Request, res: Response) => {
  const { email, password, displayName, userStatus } = req.body;
  
  try {
      const userRecord = await FIREBASE_AUTH.createUser({ email, password, displayName:displayName, });
      const uid = userRecord.uid;

      const userRef = FIRESTORE.collection('users').doc(uid);

      const userObject: UserInformation = {
        userStatus,
        uid: uid, 
        displayName: displayName
      }
        
      await userRef.set(userObject);

      res.status(200).json({
        sxtatus: "success",
        message: "User registered successfully",
        uid: uid,
      });
  } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
  }
};

registrationRouter.post('/', (req, res) => registerUser(req, res));
registrationRouter.post('/admin', (req, res) => registerUser(req, res));
registrationRouter.post('/candidate', (req, res) => registerUser(req, res));

const addCandidateInformation = async (req: Request, res: Response) => {
  const { description, personalInformation,theses,avatarUrl, uid } = req.body;

  try {
      const candidateInfoRef = FIRESTORE.collection('users').doc(uid).collection('candidate_information').doc();
     
      const candidateObject: CandidateInformation = {
        description: description, 
        personalInformation: personalInformation, 
        theses: theses, 
        avatarUrl: avatarUrl
      }

      await candidateInfoRef.set(candidateObject);

      res.status(200).json({
        status: "success",
         message: "Candidate information added successfully",
      });
  } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
  }
};


registrationRouter.post('/candidate-info', (req, res) => addCandidateInformation(req, res));

export default registrationRouter;
