import React, { useState } from 'react';
import {
    Card,
    Input,
    Button,
    Textarea,
    IconButton,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { PersonalInformation, Thesis } from "../../types/databaseTypes";
import { TypographyH3, TypographyH5, TypographyH6 } from "../../components/components";
import Loading from '../../components/shared/loadingScreen';
import {AddCircle, UploadFile} from '@mui/icons-material';
import { THESIS_TAGS } from '../../constants/constants';
import { FIRE_STORAGE, FIREBASE_AUTH } from '../../firebase.config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Avatar from '@mui/material/Avatar';

export function CandidateRegistration() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [theses, setTheses] = useState<Thesis[]>([]);
    const [description, setDescription] = useState<string>("");
    const [personalInformation, setPersonalInformation] = useState<PersonalInformation[]>([]);
    const [thesis, setThesis] = useState('');
    const [tag, setTag] = useState('');
    const [opinion, setOpinion] = useState('');
    const [newPersonalInformation, setNewPersonalInformation] = useState<PersonalInformation>({ category: '', information: '' });
    const [localButtonTags, setLocalButtonTags] = useState<string[]>(Object.values(THESIS_TAGS));
    const [file, setFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");

    const [addTagEnabled, setAddTagEnabled] = useState(true); 


    const handleAddPersonalInformation = () => {
        setPersonalInformation([...personalInformation, newPersonalInformation]);
        setNewPersonalInformation({ category: "", information: "" });
        setStep(2);
    }

    const handleAddTag = (t: string) => {
        if (tag !== t && addTagEnabled) {
            setTag(t)
            setLocalButtonTags(localButtonTags.filter(item => item !== t));
            setAddTagEnabled(false)
        }
    };

    const handleAddThesis = () => {
        const tempThesis = { thesis: thesis, opinion: opinion, tag: tag };
        setTheses([...theses, tempThesis]);
        setOpinion("");
        setThesis("");
        setTag("")
        setAddTagEnabled(true)
    };
   
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        document.getElementById('fileInput')?.click()
        if (!file) return;
        setLoading(true);

        try {
            const storageRef = ref(FIRE_STORAGE, `avatars/${FIREBASE_AUTH.currentUser?.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setAvatarUrl(url);
        } catch (error) {
            console.error("Error uploading file: ", error);
        } finally {
            setLoading(false);
        }
    };

    
    const handleSaveAllInformation = async () => {
        setLoading(true);
        try {
            setTheses(theses.sort((a, b) => a.tag.localeCompare(b.tag)))
            console.log(theses, 11111)

            const response = await fetch('http://localhost:3001/registration/candidate-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        description, 
                        personalInformation,
                        avatarUrl,
                        theses,
                        uid: FIREBASE_AUTH?.currentUser?.uid
                    }
                ),
            });

            if (!response.ok) {
                navigate('/');
            }
            else{
                navigate('/registration/candidate/goodLuck');
            }
        } catch (error) {
            console.error(error);
            throw new Error('Failed to Register');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="flex flex-col justify-between items-center h-screen">
            {!loading ? (
                <>
                    {step === 1 && (
                        <div className="flex justify-center mt-5 w-5/6 items-center">
                            <Card color="transparent" shadow={false} className="w-full max-w-md" placeholder={t("candidateInfo")}>
                                <TypographyH3 text="candidateInfo" />
                                <form className="mt-8  w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-8 py-4 border-black border-4">
                                    <TypographyH6 text={t('uploadProfilePicture')} />
                                    <div className='flex flex-row mt-4'>
                                        {avatarUrl === "" ? (
                                            <Avatar
                                            sx={{ bgcolor:"gray" , width: 96, height: 96}}
                                            alt="Remy Sharp"
                                          >
                                            {FIREBASE_AUTH.currentUser?.displayName}
                                          </Avatar>
                                        ):(
                                            <Avatar src={avatarUrl} alt="Avatar" sx={{ width: 96, height: 96 }} />
                                        )
                                        }
                                        <IconButton className="ml-8 text-white w-full" onClick={handleFileUpload} size='lg' placeholder={t('uploadFile')}>
                                            <UploadFile fontSize='medium' />
                                        </IconButton>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <div className="mb-2 flex flex-col mt-5">
                                        <TypographyH6 text={t('description')} />
                                        <Textarea
                                            size="lg"
                                            variant="outlined"
                                            label={t('description')}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value )}
                                        />
                                    </div>
                                    <div className="mb-2 flex flex-col ">
                                        <TypographyH6 text={t('degree')} />
                                        <Textarea
                                            size="lg"
                                            variant="outlined"
                                            label={t('life')}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPersonalInformation({ category: "live", information: e.target.value })}
                                        />
                                    </div>
                                    <Button className="mt-5 bg-black text-white w-full" onClick={handleAddPersonalInformation} placeholder={t('save')}>
                                        {t('save')}
                                    </Button>
                                </form>
                            </Card>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex justify-center mt-5 w-5/6 items-center">
                            <Card color="transparent" shadow={false} className="w-full max-w-md" placeholder={t("thesis")}>
                                <TypographyH3 text={t("theses")} />
                                <form className="mt-8 mb-2 w-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-8 py-4 border-black border-4">
                                    
                                    {theses.map((thesisItem, index) => (
                                        <><TypographyH5 text={thesisItem.tag} />
                                        <div className="mt-2 flex-row flex" key={index}>
                                            <TypographyH6 text={thesisItem.thesis + ": "} />
                                            <TypographyH6 text={thesisItem.opinion} />
                                        </div></>
                                    ))}
                                    <div className="mb-5 flex flex-col gap-6 w-5/6">
                                        <TypographyH6 text={t("tags")} />
                                        {addTagEnabled ? (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                            {localButtonTags.map((tag, index) => (
                                                <Button key={index} placeholder={t(tag)} onClick={() => handleAddTag(tag)} size='sm'>
                                                    {t(tag)}
                                                </Button>
                                            ))}
                                            </div>
                                        ): (
                                            <>
                                            <TypographyH6 text={tag} />
                                                <Button placeholder={t("revertTag")} onClick={() => setAddTagEnabled(true)} size='sm'>
                                                    {t("revertTag")}
                                                </Button>
                                            </>
                                        )}
                                        <Input
                                            size="lg"
                                            label={t('thesis')}
                                            placeholder={t('thesis')}
                                            value={thesis}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThesis(e.target.value)}
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                            crossOrigin={undefined}
                                        />
                                        <Textarea
                                            size="lg"
                                            placeholder={t("opinion")}
                                            value={opinion}
                                            variant="outlined"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOpinion(e.target.value)}
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                    </div>
                                    <div className='flex justify-center'>
                                        <TypographyH6 text={t("addThesis")} />
                                    </div>
                                    <div className='flex justify-center'>
                                        <IconButton className="mt-2 bg-black text-white w-full" onClick={handleAddThesis} placeholder={t('addThesis')} size='lg'>
                                            <AddCircle fontSize='small' />
                                        </IconButton>
                                    </div>
                                    {theses.length > 0 && (
                                        <Button className="mt-5 bg-black text-white w-full" onClick={handleSaveAllInformation} placeholder={t('saveTheses')}>
                                            {t('saveTheses')}
                                        </Button>
                                    )}
                                </form>
                            </Card>
                        </div>
                    )}
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
}
