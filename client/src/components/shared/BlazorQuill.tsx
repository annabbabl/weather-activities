import { useState } from "react";
import "../constants/i18next"
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { IconButton } from "@mui/material";
import SendSharp from "@mui/icons-material/SendSharp";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from "firebase/firestore";


/**
 * Functional React component for creating and submitting posts with a rich text editor.
 * This component provides a Quill rich text editor for users to compose posts, and a send button to submit these posts.
 * It handles image extraction from the editor's content, uploads the extracted image to Firebase Storage,
 * and submits the post's data, including the post content and associated metadata, to the backend server.
 *
 * @component
 * @example
 * <QuillMessage
 *   setLoading={setLoading}
 *   createdBy="userId"
 *   username="johnDoe"
 *   userImage="http://example.com/johndoe.jpg"
 *   city="New York"
 *   weather={{ temp: 20, description: "Sunny" }}
 *   addNewPost={addNewPost}
 *   day="Monday"
 * />
 *
 * @param {QuillMessageProperties} props - The properties passed to the QuillMessage component.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setLoading - Setter function to update the loading state.
 * @param {Function} props.addNewPost - Function to add the new post to the list of posts.
 * @param {string | undefined} props.createdBy - The ID of the user creating the post.
 * @param {string | undefined | null} props.username - The username of the user creating the post.
 * @param {string | undefined | null} props.userImage - The profile image URL of the user creating the post.
 * @param {string} props.city - The city associated with the weather information in the post.
 * @param {any} props.weather - The weather data to be included in the post.
 * @param {string} props.day - The day for which the post is being created.
 * @returns {React.ReactElement} A React component for creating and submitting posts.
 */

interface QuillMessageProperties {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>, 
    addNewPost: any, 
    createdBy: string | undefined, 
    username: string | undefined | null, 
    userImage: string| undefined | null, 
    city: string, 
    weather: any, 
    day: string
}



export default function QuillMessage({
    setLoading, 
    createdBy, 
    city, 
    username, 
    userImage, 
    weather, 
    addNewPost, 
    day
    }: QuillMessageProperties) {
        
        
    const [value, setValue] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();
    const createdFor = new Date(); 
    createdFor.setHours(0, 0, 0, 0);


    const endDate = new Date(createdFor.getTime() + 7 * 24 * 60 * 60 * 1000); 
    const endTimestamp = Timestamp.fromDate(endDate);  
    const cretaedOn = Timestamp.fromDate(createdFor);  



    const uploadImageFromUrl = async (imageUrl: string) => {
        if (!imageUrl) return;

        try {
            const response = await fetch(imageUrl);
            const imageBlob = await response.blob();
            const storageRef = ref(getStorage(), `images/${uuidv4()}`);
            const uploadTaskSnapshot = await uploadBytes(storageRef, imageBlob);
            const uploadedImageUrl = await getDownloadURL(uploadTaskSnapshot.ref);
            return uploadedImageUrl;
        } catch (error) {
            console.error('Error uploading image from URL:', error);
            return null; 
        }
    };

    const extractAndUploadImage = async (value: string) => {
        const srcRegex = /<img[^>]+src="([^"]+)"[^>]*>/;
        const match = srcRegex.exec(value);
        if (match && match[1]) {
            const uploadedImageUrl = await uploadImageFromUrl(match[1]);
            if (uploadedImageUrl) {
                return value.replace(match[1], uploadedImageUrl);
            }
        }
        return value; 
    };


    const modules = {
        toolbar: {
            container: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', { 'color': [] }, { 'size': [] }],
                [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                ],
                ['link', 'image'],
            ],
            
        },
        clipboard: {
            matchVisual: false,
        },
    };
   
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'color'
    ]

    const sendPost = async () => {
        if (!createdBy) {
            navigate('/login');
            return; 
        }
    
        setLoading(true);
        const id = uuidv4();
        const likes = { amount: 0, likedUser: [] };
    
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        const newValue = await extractAndUploadImage(value);
        
        const postEdit = {
            id,
            content: newValue,
            createdBy,
            createdFor: day,
            cretaedOn: cretaedOn,
            city,
            endDate: endTimestamp,
            weather,
            likes,
            username: username || "",
            userImage: userImage || "",
        };
        console.log(postEdit, 1289289)
        
        try {
            const serverResponse = await fetch('http://localhost:3001/uploadPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postEdit),
            });

            

            if (!serverResponse.ok) {
                throw new Error('Server response was not ok.');
            }

            const responseData = await serverResponse.json(); 
            addNewPost(responseData.post); 
            setValue('');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <ReactQuill 
                modules={modules} 
                placeholder={t('writePost') + '...'} 
                value={value} 
                onChange={setValue} 
                formats={formats} 
                style={{height: 80}}
            />
            <IconButton
                style={{ color: "blue", marginTop: 10}}
                size="large"
                onClick={sendPost}
            >
                <SendSharp fontSize="medium"/>
            </IconButton>
        </>
    )
}
