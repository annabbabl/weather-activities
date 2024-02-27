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


interface QuillMessageProperties {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>, 
    addNewPost: any, 
    createdBy: string | undefined, 
    username: string | undefined | null, 
    userImage: string| undefined | null, 
    city: string, 
    weather: any, 
}



export default function QuillMessage({
    setLoading, 
    createdBy, 
    city, 
    username, 
    userImage, 
    weather, 
    addNewPost, 
    }: QuillMessageProperties) {
        
        
    const [value, setValue] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();
    const createdFor = new Date(); 

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
    
    const formattedDate = [
        ('0' + createdFor.getDate()).slice(-2),
        ('0' + (createdFor.getMonth() + 1)).slice(-2),
        createdFor.getFullYear() 
    ].join('-');

    const sendPost = async () => {
        if (!createdBy) {
            navigate('/login');
            return; // Prevent further execution if not logged in
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
            createdFor: formattedDate,
            city,
            weather,
            likes,
            username: username || "",
            userImage: userImage || "",
        };
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

            const responseData = await serverResponse.json(); // Assuming you want to do something with response
            addNewPost(responseData.post); // Assuming you want to add the returned post
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
