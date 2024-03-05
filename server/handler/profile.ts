import express, { Request, Response } from 'express';
import multer, {  } from 'multer'
import { FIREBASE_AUTH, FIRESTORE, FIRE_STORAGE } from '../firebase.config';
import {  UserEdit } from '../databaseTypes';


const upload = multer({ dest: 'uploads/' }); 

const profileRouter = express.Router();


/**
 * Handles the uploading of a user profile picture. It stores the picture in Firebase Storage,
 * updates the user's profile in Firestore, and updates the photo URL in Firebase Auth.
 * 
 * @namespace profileRouter
 * @route POST /uploadPicture
 * @param {multer} upload Middleware for handling multipart/form-data, which is used for uploading files.
 * @param {express.Request} req Express request object, expects a file and the user's UID in the body.
 * @param {express.Response} res Express response object.
 * @returns {void} Responds with success status and download URL of the uploaded picture, or an error message upon failure.
 */
profileRouter.post('/uploadPicture', upload.single('file'), async (req: Request, res: Response) => {
    const { file, body: { uid } } = req;
  
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
  
    try {
      const bucket = FIRE_STORAGE.bucket(); 
      const storageRef = bucket.file(file.originalname); 
  
      await storageRef.save(file.buffer, {
        contentType: file.mimetype,
      });
  
      const downloadURL = await storageRef.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
      });
  
      const userRef = FIRESTORE.collection('users').doc(uid);
      await userRef.update({ profilePicture: downloadURL[0] });
  
      await FIREBASE_AUTH.updateUser(uid, { photoURL: downloadURL[0] });
  
      res.json({ success: true, message: "File uploaded successfully", downloadURL: downloadURL[0] });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  /**
 * Updates user profile information in Firestore and Firebase Auth based on provided details.
 * 
 * @namespace profileRouter
 * @route POST /editProfile
 * @param {express.Request} req Express request object, expects user ID, email, username, and password in the body.
 * @param {express.Response} res Express response object.
 * @returns {void} Responds with success status and updated user information upon success, or an error message upon failure.
 */
  profileRouter.post('/editProfile', async (req: Request, res: Response) => {
    const { id, email, username, password } = req.body;
  
    try {    
  
      const updatedData: UserEdit  = {
        email: email, 
        password: password, 
        username: username,
      }
  
      const userRef = FIRESTORE.collection('users').doc(id);
  
      await userRef.set(updatedData)
      .then(() => {
          console.log('Profile successfully updated!');
          FIREBASE_AUTH.updateUser(id, {displayName: username, email: email, password: password})
  
          res.status(200).json({
            status: "success",
            message: "User status updated successfully",
            uid: id,
            username: username, 
            password: password,
            email: email
          });
      })
      .catch((error: any) => {
          console.error('Error updating Profile:', error);
          throw error;
      })
  
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  /**
 * Logs out a user by updating their loggedIn status in Firestore.
 * 
 * @namespace profileRouter
 * @route POST /logout
 * @param {express.Request} req Express request object, expects user ID in the body.
 * @param {express.Response} res Express response object.
 * @returns {void} Responds with success status upon successfully logging out the user, or an error message upon failure.
 */
  profileRouter.post('/logout', async (req: Request, res: Response) => {
    const { id } = req.body;
  
    try {    
         
      const userRef = FIRESTORE.collection('users').doc(id);
  
      await userRef.set({ loggedIn: false })
      .then(() => {
          console.log('Profile successfully updated!');
          res.status(200).json({
            status: "success",
            message: "User status updated successfully",
            id: id,
          });
      })
      .catch((error: any) => {
          console.error('Error updating Profile:', error);
          throw error;
      })
  
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
});

export { 
    profileRouter
};
  