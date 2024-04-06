import express from 'express';
import { FIRESTORE, FIRE_ADMIN } from '../firebase.config';
import { UserEdit } from '../utils/databaseTypes';


const registrationRouter = express.Router();

/**
 * Registers a new user in the Firebase authentication system and stores additional user information in Firestore.
 * This endpoint accepts user details, creates a new user record in Firebase Auth, 
 * and saves additional user-specific information like username and login status in Firestore.
 * 
 * @namespace registrationRouter
 * @route POST /
 * @param {express.Request} req Express request object, expects user details such as email, password, username, and loggedIn status in the body.
 * @param {express.Response} res Express response object.
 * @returns {void} Responds with the newly created user's UID, email, and username upon success, or an error message upon failure.
 */
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
  