import express, { Request, Response } from 'express';
import { FIREBASE_AUTH, FIRESTORE,} from './firebase.config';
import weatherFetching from './weatherAPI';
import { PostEdit } from './databaseTypes';
import { pickBy } from 'lodash'
import { Timestamp } from 'firebase-admin/firestore'



export const indexRouter = express.Router();

/**
 * Updates user login status based on Firebase authentication token.
 * @route PATCH /login
 * @param {Request} req Express request object, expects idToken in body.
 * @param {Response} res Express response object.
 * @returns Responds with user UID and success message upon successful login status update.
 */
indexRouter.patch('/login', async (req: Request, res: Response) => {
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


/**
 * Sets the location of the user and updates weather information accordingly.
 * This endpoint allows updating the user's city and managing associated weather data, 
 * including removal of outdated weather information and posts.
 * @route POST /setLocation
 * @param {Request} req Express request object, expects idToken, city, longitude, latitude in body.
 * @param {Response} res Express response object.
 * @returns Responds with success message and status upon successful location and weather update.
 *//**
 * Sets the location of the user and updates weather information accordingly.
 * This endpoint allows updating the user's city and managing associated weather data, 
 * including removal of outdated weather information and posts.
 * @route POST /setLocation
 * @param {Request} req Express request object, expects idToken, city, longitude, latitude in body.
 * @param {Response} res Express response object.
 * @returns Responds with success message and status upon successful location and weather update.
 */
indexRouter.post('/setLocation', async (req, res) => {
  const { idToken, city, longitude, latitude } = req.body;

  try {

      if (idToken) {
          const userRef = FIRESTORE.collection('users').doc(idToken);
          const userSnapshot = await userRef.get();
          const currentUserCity = userSnapshot.data()?.city;

        if (currentUserCity !== city) {
            await userRef.update({ city });
            console.log("User's city updated successfully.");
        }
      }

      const weatherCollectionRef = FIRESTORE.collection("weatherInformation");
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const endDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); 
      const currentTimestamp = Timestamp.fromDate(currentDate);
      const endTimestamp = Timestamp.fromDate(endDate);  

      const cityWeatherSnapshot = await weatherCollectionRef
        .where("city", "==",city)
        .get();

      const batch = FIRESTORE.batch(); 

      if (!cityWeatherSnapshot.empty) {

          const oldWeatherSnapshot = await weatherCollectionRef
            .where("city", "==",city)
            .where("endDate", "<", currentTimestamp)
            .get();

          if (!oldWeatherSnapshot.empty) {
            console.log("Data up to date");
          } else {
            console.log("Weather data gets updated")
            const weather = await weatherFetching(latitude, longitude);

            weather.forEach(async (dayWeather: any) => {
              const dayOfWeek = dayWeather.day; 

              const matchingDocsSnapshot = await weatherCollectionRef
                .where("city", "==", city)
                .where("dayOfWeek", "==", dayOfWeek) 
                .get();

              if (!matchingDocsSnapshot.empty) {
                matchingDocsSnapshot.docs.forEach(doc => {
                  batch.set(doc.ref, {
                    ...dayWeather,
                    city,
                    startDate: currentTimestamp,
                    endDate: endTimestamp,
                  });
                });
              }
            });
          }
        await batch.commit();
      }else{
          const weather = await weatherFetching(latitude, longitude);
          weather.forEach((dayWeather: any) => {
            const newWeatherDocumentRef = weatherCollectionRef.doc(); // Create a new document reference for each day
            dayWeather.city = city;
            dayWeather.creationDate = currentTimestamp;
            dayWeather.endDate =  endTimestamp; 
            batch.set(newWeatherDocumentRef, dayWeather);
        });
      }
      await batch.commit();

      const postsCollectionRef = FIRESTORE.collection("posts");

      const oldPostsSnapshot = await postsCollectionRef.where("endDate", "<",currentDate).get();
      
      const userCollectionRef = FIRESTORE.collection("users");

      if (!oldPostsSnapshot.empty) {
        const oldPostIds = oldPostsSnapshot.docs.map(doc => doc.id);
        const postBatch = FIRESTORE.batch();
      
        oldPostsSnapshot.docs.forEach(doc => {
          const docRef = postsCollectionRef.doc(doc.id); 
          postBatch.delete(docRef);
        });

        await postBatch.commit();

        const userSnapshot = await userCollectionRef.where("savedPosts", "array-contains-any", oldPostIds).get();
        if (!userSnapshot.empty) {
            const userBatch = FIRESTORE.batch();

            userSnapshot.docs.forEach(doc => {
              const updatedSavedPosts = doc.data().savedPosts.filter((postId: string) => !oldPostIds.includes(postId));
              const userDocRef = userCollectionRef.doc(doc.id);
              userBatch.update(userDocRef, { savedPosts: updatedSavedPosts }); 
            });

            await userBatch.commit();
        }
      }
      res.status(200).json({ success: true, message: "Weather and place detected" });
  } catch (error: any) {
      console.error("Error processing request:", error);
      res.status(400).json({ success: false, message: error.message });
  }
});


/**
 * Updates the like count of a post based on user interactions.
 * @route PATCH /likePost
 * @param {Request} req Express request object, expects id, amount, likedUser in body.
 * @param {Response} res Express response object.
 * @returns Responds with updated like data and success message upon successful update.
 */
indexRouter.patch('/likePost', async (req: Request, res: Response) => {
  const { id, amount, likedUser } = req.body;

  try {
    const postRef = FIRESTORE.collection('posts').doc(id);

    const likesUpdate = {
      likes: { amount, likedUser }
    };

    await postRef.update(likesUpdate)
      .then(() => {
        console.log('New Like');
      })
      .catch((error: any) => {
        console.error('Error liking', error);
        throw error;
      });

    res.status(200).json({
      status: "success",
      message: "Post liked",
      likeData: { id, likes: likesUpdate.likes },
    });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

indexRouter.patch('/savePost', async (req: Request, res: Response) => {
  const { userId, savedPosts } = req.body; 

  try {
    const userRef = FIRESTORE.collection('users').doc(userId);
    await userRef.update({ savedPosts: savedPosts });

    res.status(200).json({
      status: "success",
      message: "Post saved successfully",
    });
  } catch (error: any) {
    console.error('Error saving post:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * Uploads a new post to the database with given user and post details.
 * @route POST /uploadPost
 * @param {Request} req Express request object, expects post details like id, content, createdBy, etc., in body.
 * @param {Response} res Express response object.
 * @returns Responds with success message and post details upon successful upload.
 */

indexRouter.post('/uploadPost', async (req: Request, res: Response) => {
  const { id, content, createdBy, endDate, userId, createdFor, cretaedOn,  city, weather, username, userImage, likes, sendImg } = req.body;

  try {
    const post: PostEdit = {
      content, 
      createdBy, 
      createdFor,
      cretaedOn, 
      endDate,  
      city, 
      weather,
      userId,
      username: username || "", 
      userImage: userImage || "",
      likes: likes || { amount: 0, likedUser: [] } // Default like structure if not provided
    };

    const cleanedObject = pickBy(post, v => v !== undefined); // Clean object for undefined values

    await FIRESTORE.collection('posts').doc(id).set(cleanedObject)
      .then(() => {
          console.log('Posted');
      })
      .catch((error: any) => {
          console.error('Error posting', error);
          throw error;
      });

    res.status(200).json({
      status: "success",
      message: "Post added successfully",
      id,
      post: cleanedObject,
    });

  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});


