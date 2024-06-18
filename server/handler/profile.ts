import express, { Request, Response } from 'express';
import { pickBy } from 'lodash'
import { Timestamp } from 'firebase-admin/firestore'
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.config';


export const profileRouter = express.Router();

profileRouter.patch('/', async (req: Request, res: Response) => {
    const { idToken } = req.body;
  
    try {      
      const decodedToken = await FIREBASE_AUTH.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      
      const userRef = FIRESTORE.collection('users').doc(uid);

      await userRef.set({ loggedIn: true }, { merge: true })
      .then(() => {
          console.log('Document successfully updated!');
      })
      .catch((error: any) => {
          console.error('Error updating document:', error);
          throw error;
      })

      res.status(200).json({
        status: "success",
        message: "User status updated successfully",
        uid: uid,
      });

    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
});


