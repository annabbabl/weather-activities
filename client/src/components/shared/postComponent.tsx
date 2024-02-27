import React, { useState, forwardRef} from 'react'; // Corrected import statement for React
import '../../constants/i18next';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useTranslation } from 'react-i18next';
import { Likes, PostEdit } from '../../types/databaseTypes';
import { DefautlProps } from '../../types/component.props';
import { Button } from '@mui/material';
import { GOOD_WEATHER_COLORS } from '../../constants/theme';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import './postComponent.css';
import '../../../node_modules/react-quill/dist/quill.snow.css';


interface PostComponentProps extends DefautlProps {
  post: PostEdit;
  currentUser: User | null,
  likes?: Likes,
  postLikes: Likes,
  savedPosts: Array<string>,
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
  savedPosts
}, ref) => {
  const { t } = useTranslation();
  const navigate = useNavigate(); 

  const [liked, setLiked] = useState((post.likes?.likedUser?.find(likeUser => likeUser === currentUser?.uid)? true: false))
  const [likeAmount, setLikeAmount] = useState(post?.likes?.amount ? post.likes.amount : 0)
  
  const [saved, setSaved] = useState( (savedPosts.find(postID => postID === post.id)) ? true: false)


  setLikes?.(postLikes)

  const savePost = async () => {
    if(!currentUser){
      navigate("/login")
    }

    try {
      let savedPostsLocal = savedPosts ?? []; 

      if(!saved) {
        const newlyAddedPost = post.id ?? "";
        savedPostsLocal = [...savedPosts, newlyAddedPost]; 
        setSaved(true)
        setLiked(true)
      } else {
        setSaved(false)
        savedPostsLocal = savedPosts.filter(postID => post.id !== postID); 
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
            avatar={
                post.userImage ? (
                    <Avatar aria-label={t('profilePicture')} src={post.userImage}/>
                ) : (
                    <Avatar sx={{ bgcolor: GOOD_WEATHER_COLORS.thirdColor }} aria-label={t('profilePicture')}>
                      {(post.username && post.username.length > 0) ? post.username[0].toUpperCase() : "U"}
                    </Avatar>
                )
            }
            title={post.username}
            subheader={post.createdFor?.toString().replace(/-/g, '.')}
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