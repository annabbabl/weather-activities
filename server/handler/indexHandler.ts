import express, { Request, Response } from 'express';
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.config';

export const indexRouter = express.Router();

indexRouter.patch('/login', async (req: Request, res: Response) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await FIREBASE_AUTH.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userRef = FIRESTORE.collection('users').doc(uid);

    await userRef.set({ loggedIn: true }, { merge: true });

    res.status(200).json({
      status: "success",
      message: "User status updated successfully",
      uid: uid,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});
