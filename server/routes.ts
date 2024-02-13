import express, { Request, Response } from 'express';
import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE, FIRE_ADMIN } from '../firebase.config';

const indexRouter = express.Router();
const loginRouter = express.Router();
const registrationRouter = express.Router();
const usersRouter = express.Router();
const testAPIRouter = express.Router();


indexRouter.get('/', (req: Request, res: Response) => {
  res.send('Index Page');
});

usersRouter.get('/', (req: Request, res: Response) => {
  res.send('Users List');
});

testAPIRouter.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Test API Response' });
});

loginRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { idToken } = req.body;
  
    try {
      // Authenticate the user using Firebase Admin SDK
      
      const decodedToken = await FIREBASE_AUTH.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      
      const loggedInData  = {
        loggedIn: false 
      }

      const userRef = FIRESTORE.collection('users').doc(uid);

      await userRef.set({ loggedIn: true }, { merge: true })
      .then(() => {
          console.log('Document successfully updated!');
          console.log("Document successfully updated!")
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

registrationRouter.post('/registration', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const userRecord = await FIRE_ADMIN.auth().createUser({
            email: email,
            password: password,
            displayName: username,
        });

        const firestore = FIRE_ADMIN.firestore();
        const usersCollection = firestore.collection('users');

        await usersCollection.doc(userRecord.uid).set({
            email: email,
            username: username,
            created_at: Date.now(),
            loggedIn: false,
        });

        res.status(201).send({ uid: userRecord.uid, email: userRecord.email, username: userRecord.displayName });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});


export { 
  indexRouter, 
  usersRouter, 
  testAPIRouter, 
  registrationRouter,
  loginRouter
};