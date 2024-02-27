import express, { Request, Response } from 'express';
import multer, {  } from 'multer'
import { FIREBASE_AUTH, FIRESTORE, FIRE_STORAGE } from '../firebase.config';
import {  UserEdit } from '../databaseTypes';


const upload = multer({ dest: 'uploads/' }); 

const profileRouter = express.Router();

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
  