import React, { useState, forwardRef} from 'react'; // Corrected import statement for React
import '../../constants/i18next';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useTranslation } from 'react-i18next';
import { Likes, PostEdit } from '../../types/databaseTypes';
import { DefautlProps } from '../../types/component.props';
import { Button } from '@mui/material';
import { Typography } from '@material-tailwind/react';
import { Link } from "react-router-dom";
import { GOOD_WEATHER_COLORS } from '../../constants/theme';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import '../../../node_modules/react-quill/dist/quill.snow.css';
import { FIREBASE_AUTH } from '../../firebase.config';

/**
 * Functional React component for displaying a single post.
 * This component shows the post's content, author, creation date, and associated images.
 * It also allows users to like or save the post, updating the respective states and databases accordingly.
 * The like and save statuses are reflected in the icon states and counts displayed.
 * Additionally, if the post contains an image, it will be displayed within the card content.
 *
 * @component
 * @example
 * <PostComponent
 *   post={post}
 *   setMessage={setMessage}
 *   setError={setError}
 *   setLoading={setLoading}
 *   currentUser={currentUser}
 *   likes={likes}
 *   setLikes={setLikes}
 *   postLikes={postLikes}
 *   savedPosts={savedPosts}
 * />
 *
 * @param {PostComponentProps} props - The properties passed to the PostComponent.
 * @param {PostEdit} props.post - The post data to be displayed.
 * @param {Function} props.setMessage - Setter function to update the global message state.
 * @param {Function} props.setError - Setter function to update the global error state.
 * @param {Function} props.setLoading - Setter function to control the loading state.
 * @param {User | null} props.currentUser - The current user's authentication object.
 * @param {Likes | undefined} props.likes - The current likes state for the post.
 * @param {Function | undefined} props.setLikes - Setter function to update the likes state for the post.
 * @param {Likes} props.postLikes - The likes associated with the post.
 * @param {Array<string>} props.savedPosts - Array containing the IDs of posts saved by the user.
 * @returns {React.ReactElement} A React component representing a single post with interactive like and save features.
 */

interface PostComponentProps extends DefautlProps {
  post: PostEdit;
  currentUser: User | null,
  likes?: Likes,
  postLikes: Likes,
  savedPosts?: Array<string>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLikes?: React.Dispatch<React.SetStateAction<Likes>>,
}

const PostComponent = forwardRef<HTMLDivElement, PostComponentProps>(({
  post, 
  setMessage, 
  setError, 
  setLoading, 
  currentUser, 
  likes, 
  setLikes,
  postLikes, 
  savedPosts,
  setPath
}, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const firebaseUser = FIREBASE_AUTH.currentUser
  const [liked, setLiked] = useState((post.likes?.likedUser?.find(likeUser => likeUser === currentUser?.uid)? true: false))
  const [likeAmount, setLikeAmount] = useState(post?.likes?.amount ? post.likes.amount : 0)
  
  const [saved, setSaved] = useState( (savedPosts?.find(postID => postID === post.id)) ? true: false)

  
  const date = post.cretaedOn ? new Date(post.cretaedOn.seconds * 1000): new Date()

  const formattedDate = [
      ('0' + date.getDate()).slice(-2), 
      ('0' + (date.getMonth() + 1)).slice(-2), 
      date.getFullYear() // Year
  ].join('.'); 

  const messagePropData = {
    userId: post.userId, 
    chatUser: firebaseUser?.uid, 
    chatname: post.username, 
  }

  setLikes?.(postLikes)

  const savePost = async () => {
    if(!currentUser){
      navigate("/login")
    }

    try {
      let savedPostsLocal = savedPosts ?? [];
      const s = savedPosts ?? []; 

      if(!saved) {
        const newlyAddedPost = post.id ?? ""; // Safeguard against undefined post.id
        savedPostsLocal = [...s, newlyAddedPost]; 
        setSaved(true)
        setLiked(true)
      } else {
        setSaved(false)
        savedPostsLocal = s.filter(postID => post.id !== postID); 
      }

      const response = await fetch('http://localhost:3001/savePost', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ savedPosts: savedPostsLocal, userId: currentUser?.uid }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        console.log(data);
        setMessage?.(t('postSaved'));
        setError?.(false);
      } else {
        throw new Error(t('failedSavePost'));
      }
      setMessage?.("")
      setError?.(false)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const likePost = async () => {
    
    if(!currentUser){
      navigate("/login")
    }

    try {
      let amountOfLikes = likeAmount ?? 0; 
      let likedUsers = likes?.likedUser ?? []; 
        
      if(!liked) {
        amountOfLikes += 1;
        const newUid = currentUser?.uid ?? "";
        likedUsers = [...likedUsers, newUid]; 
        setLikeAmount(amountOfLikes)
        setLiked(true)
      } else {
        amountOfLikes -= 1; 
        likedUsers = likedUsers.filter(user => user !== currentUser?.uid); 
        setLikeAmount(amountOfLikes)
        setLiked(false)
      }
    
      const likedData = {
        id: post.id,
        amount: amountOfLikes,
        likedUser: likedUsers
      };
    
      const response = await fetch('http://localhost:3001/likePost', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(likedData),
      });
    
      const data = await response.json();
    
      if (response.ok) {
        console.log(data);
        setMessage?.(t('liked'));
        setError?.(false);
        setLikes?.({likedUser: likedUsers, amount: amountOfLikes});
        setLiked((likedUsers.find(likedUser => likedUser === currentUser?.uid) ? true : false));
      } else {
          throw new Error(t('failedLikingPost'));
      }
      setMessage?.("");
      setError?.(false)
    } catch (error) {
      console.error(error);
      setError?.(true);
      setMessage?.(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card sx={{ maxWidth: 800, marginTop: 3, minWidth: 400}} ref={ref}>
        <CardHeader
          subheader={t("createdOn")+ formattedDate.toString()}
        />
      {post.img && ( 
        <CardMedia
          component="img"
          height="194"
          image={post.img}
          alt={t('image')}
        />
      )}
      <CardContent>
        <div className='ql-container ql-snow"'>
        {firebaseUser?.uid !== post.userId ? (
          <Link 
            to={`/messages/${post.username}`} 
            style={{ color: "blue" }}
            state={messagePropData}
            onClick={() => setPath?.("/messages")}
          >
            {post.username}
          </Link>
        ) : (
          <Typography variant="h6" placeholder={t('infomration')}>
            {post.username}
          </Typography>
        )}
          {post.content  && (
            <div 
              className="ql-editor custom-content" // Add this line
              dangerouslySetInnerHTML={{ __html: post.content }} 
              style={{ color: 'rgba(0, 0, 0, 0.6)' }} 
            />
          )}
        </div>
      </CardContent>
      <CardActions disableSpacing onClick={likePost}>
        {likes && (
          <Button variant="text" style={{ color: GOOD_WEATHER_COLORS.thirdColor }} startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}>
            {likeAmount}
          </Button>
        )}
        <IconButton aria-label="save" onClick={savePost} style={{ color: GOOD_WEATHER_COLORS.thirdColor }}>
              {saved ? (
                <BookmarkIcon />
              ) : (
                <BookmarkBorderIcon />
              )}
        </IconButton>
      </CardActions>
    </Card>
  );
})

export default PostComponent;