import express from 'express';
import { FIRESTORE, FIRE_ADMIN } from '../firebase.config';
import { UserEdit } from '../databaseTypes';



const registrationRouter = express.Router();


registrationRouter.post('/', async (req, res) => {
    const { email, password, username, loggedIn } = req.body;

    try {
        const userRecord: UserEdit = await FIRE_ADMIN.auth().createUser({
            email: email,
            password: password,
            displayName: username,
        });

        const usersCollection = FIRESTORE.collection('users');
        
        if(userRecord?.uid){
          await usersCollection.doc(userRecord?.uid).set({
            email: email,
            username: username,
            created_at: Date.now(),
            loggedIn: loggedIn,
        });
        }
        
        res.status(201).send({ uid: userRecord.uid, email: userRecord.email, username: userRecord.displayName });
      } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});


export { 
    registrationRouter,
};
  