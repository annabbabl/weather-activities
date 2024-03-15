import express, { Request, Response } from 'express';
import multer, {  } from 'multer'
import { FIREBASE_AUTH, FIRESTORE } from '../firebase.config';
import weatherFetching from '../weatherAPI';
import { PostEdit } from '../databaseTypes';
import { pickBy } from 'lodash'



const indexRouter = express.Router();

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
/*
  We client sends out a idToken, if the user is logged in, the city, which it fetches from LocationiQ and 
  the longitude and latitude, which it got from the js navigator.geolocation. 
  We check if the user city needs to be updated, if so, we update it. 
  After that we check, if the city is already in our database, if not, we set the weatherdata in our weathercollection. We fetched the weatherdata from OpenWeatherMap in weatherAPI.ts. 
  If we have information about the weather in the city, we look, if this information is from the previous day, if so, the information gets updated, if not, we do nothing. 
  Also we check if the date post were written for, are in the past, if so, we delete them. Since in firebase you can not compare dates properly, i decide to implement the logic just for the last past date
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

      const formattedCurrentDate = [
        ('0' + currentDate.getDate()).slice(-2),
        ('0' + (currentDate.getMonth() + 1)).slice(-2),
        currentDate.getFullYear() 
      ].join('-');


      currentDate.setHours(0, 0, 0, 0);

      const cityWeatherSnapshot = await weatherCollectionRef
        .where("city", "==",city)
        .get();

      const batch = FIRESTORE.batch(); 

      if (!cityWeatherSnapshot.empty) {

          const oldWeatherSnapshot = await weatherCollectionRef
            .where("city", "==",city)
            .where("creationDate", "==", formattedCurrentDate)
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
                    creationDate: formattedCurrentDate,
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
            dayWeather.creationDate = formattedCurrentDate;
            batch.set(newWeatherDocumentRef, dayWeather);
        });
      }
      await batch.commit();

      const postsCollectionRef = FIRESTORE.collection("posts");
      const pastDay = new Date(currentDate); 
      pastDay.setDate(pastDay.getDate() - 1)      

      const formattedPastDate = [
        ('0' + pastDay.getDate()).slice(-2),
        ('0' + (pastDay.getMonth() + 1)).slice(-2),
        pastDay.getFullYear() 
      ].join('-');

      const oldPostsSnapshot = await postsCollectionRef.where("createdFor", "==",formattedPastDate).get();
      
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

            // Commit the user updates
            await userBatch.commit();
        }
      }
      res.status(200).json({ success: true, message: "Weather and place detected" });
  } catch (error: any) {
      console.error("Error processing request:", error);
      res.status(400).json({ success: false, message: error.message });
  }
});

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


indexRouter.post('/uploadPost', async (req: Request, res: Response) => {
  const { id, content, createdBy, createdFor, city, weather, username, userImage, likes, userId } = req.body;

  try {
    const post: PostEdit = {
      content, 
      createdBy, 
      createdFor, 
      city, 
      weather,
      username: username || "", 
      userId: userId, 
      userImage: userImage || "",
      likes: likes || { amount: 0, likedUser: [] } // Default like structure if not provided
    };
    console.log(userId)

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

export { 
  indexRouter
};
