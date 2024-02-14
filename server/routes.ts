import express, { Request, Response } from 'express';
import multer, {  } from 'multer'
import { FIREBASE_AUTH, FIRESTORE, FIRE_ADMIN, FIRE_STORAGE } from './firebase.config';

const upload = multer({ dest: 'uploads/' }); 

const indexRouter = express.Router();
const loginRouter = express.Router();
const registrationRouter = express.Router();
const usersRouter = express.Router();
const testAPIRouter = express.Router();
const profileRouter = express.Router();


indexRouter.get('/', (req: Request, res: Response) => {
  const f = FIRESTORE.collection("users").doc("6bFkEUnROsrFQHh4RIaI")
  console.log(f.id)
  console.log(f.get())
  res.send(f.get());
});

usersRouter.get('/', (req: Request, res: Response) => {
  res.send( {message: 'Test API Response'} );
});

testAPIRouter.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Test API Response' });
});

indexRouter.post('/login', async (req: Request, res: Response) => {
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


profileRouter.get('/:uid/posts', async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
      const userRef = FIRESTORE.collection('users').doc(uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const userData = userSnap.data();
      
      const postsQuerySnapshot = await FIRESTORE.collection('posts')
          .where('createdBy', '==', uid)
          .get();

      const postsData = postsQuerySnapshot.docs.map(doc => doc.data());

      // Combine user data and posts data
      const userWithPosts = {
          ...userData,
          posts: postsData,
      };

      res.json({ success: true, user: userWithPosts });
  } catch (error: any) {
      console.error('Error fetching user with posts:', error);
      res.status(500).json({ success: false, message: error.message });
  }
});

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
  console.log(id, email, username, password);

  try {    

    const updatedData  = {
      emai: email, 
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
profileRouter.post('/loggout', async (req: Request, res: Response) => {
  const { idToken } = req.body;
  console.log(idToken);

  try {    
   
    const decodedToken = await FIREBASE_AUTH.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const userRef = FIRESTORE.collection('users').doc(uid);

    await userRef.set({ loggedIn: false })
    .then(() => {
        console.log('Profile successfully updated!');
        res.status(200).json({
          status: "success",
          message: "User status updated successfully",
          uid: uid,
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

registrationRouter.post('/', async (req, res) => {
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
  loginRouter, 
  profileRouter
};