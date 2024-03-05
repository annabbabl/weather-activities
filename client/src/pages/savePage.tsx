import {
    Typography,
  } from "@material-tailwind/react";
import '../constants/i18next'
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE } from "../firebase.config";
import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { DefautlProps } from "../types/component.props";
import {Link} from 'react-router-dom';
import { SetAlert } from "../constants/popUps";
import Loading from "react-loading";
import { PostEdit } from "../types/databaseTypes";
import PostComponent from "../components/shared/postComponent";


/**
 * Functional React component for the saved posts page.
 * This component displays posts saved by the current user.
 * It fetches the user's saved posts from Firestore based on their user ID and then retrieves each saved post.
 * If there are no saved posts or if the user is not logged in, appropriate messages are displayed.
 * The component also manages loading states and displays error messages using the SetAlert component.
 *
 * @component
 * @example
 * <SavePage 
 *   setError={setError}
 *   setMessage={setMessage}
 *   message="Failed to fetch saved posts"
 *   error={true}
 * />
 *
 * @param {DefautlProps} props - The properties passed to the SavePage component.
 * @param {Function} props.setError - Setter function to update the error state.
 * @param {Function} props.setMessage - Setter function to update the message state.
 * @param {string} props.message - Current message to be displayed as feedback.
 * @param {boolean} props.error - Indicates if there is an error state.
 * @returns {React.ReactElement} A React component for the saved posts screen.
 */

export default function SavePage({setMessage, setError, message, error}: DefautlProps) {
    const { t } = useTranslation();
    const currentUser = FIREBASE_AUTH.currentUser;    
    const [savedPosts, setSavedPosts] = useState<Array<string>>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [posts, setPosts] = useState<Array<PostEdit>>([]);


    useEffect(() => {
      const fetchSavedPosts = async () => {
          if (currentUser) {
              try {
                  setLoading(true);
                  const userDocRef = doc(FIRESTORE, 'users', currentUser.uid);
                  const docSnap = await getDoc(userDocRef);

                  if (docSnap.exists()) {
                      const userSavedPosts = docSnap.data().savedPosts;
                      if (userSavedPosts) {
                          setSavedPosts(userSavedPosts);
                          const postsCollectionRef = collection(FIRESTORE, "posts");
                          const savedPostsQuery = query(postsCollectionRef, where(documentId(), 'in', userSavedPosts));
                          const querySnapshot = await getDocs(savedPostsQuery);
                          const fetchedPosts: Array<PostEdit> = [];
                          querySnapshot.forEach((doc) => {
                              fetchedPosts.push({ id: doc.id, ...doc.data() });
                          });
                          setPosts(fetchedPosts);
                      }
                  } else {
                    console.log("No user found with uid:", currentUser.uid);
                  }
              } catch (error) {
                console.error('Error fetching user data:', error);
                console.log(t('errorFetchingPosts'));
                setMessage?.(t('errorFetchingPosts'))
                setError?.(true)
              } finally {
                setLoading(false);
              }
          } else {
            console.log("No user logged in");
          }  
      };

      fetchSavedPosts();
  }, [currentUser, setError, setMessage, t]);
    return (
        <div className='min-h-screen'>
          {!loading ? (
            <div className="flex flex-col justify-center mt-5 items-center ">
              {currentUser ? (
              <>
               <Typography variant="h2" color="blue-gray" placeholder={t('noSavedPostsYet')} style={{marginTop: 4}}>
                    {t('savedPosts')}
                </Typography>
                {savedPosts && savedPosts.length > 0 ? (
                  <div className='items-center mt-4'>
                    {posts.map((post) => (
                        <PostComponent 
                          key={post.id}
                          post={post}
                          setError={setError}
                          setMessage={setMessage}
                          setLoading={setLoading}
                          currentUser={currentUser}
                          postLikes={post.likes ?? {}}
                          savedPosts={savedPosts}
                        />
                    ))}
                  </div>
                ):(
                  <Typography variant="h4" color="blue-gray" placeholder={t('noSavedPostsYet')}>
                    {t('noSavedPostsYet')}
                  </Typography>
                )}
            </>
              ): (
                <>
                  <Typography variant="h4" color="blue-gray" placeholder={t('noSavedNoSignUp')}>
                    {t('noSavedNoSignUp')}
                  </Typography>
                  <Link to="/login" color="blue" style={{ color: "blue" }}>{t('signIn')}</Link>
                </>
              )}
              <div className="flex justify-end w-screen h-80">
                <SetAlert error={error} message={(message ? message : "")} />
              </div>
            </div> 
            ): (
              <Loading/>
            )}
        </div>
    );
}