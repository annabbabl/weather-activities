import { useNavigate } from 'react-router-dom';
import "../constants/"
import { useTranslation } from "react-i18next";
import { Button } from '@material-tailwind/react';
import { TypographyH3 } from './components';
import { StandartBlueWave } from './shared/waves';

interface FinalProps {
    text: string; 
    link?: string; 
}

export const FinalElement: React.FC<FinalProps> = ({ text, link = "/" }) =>  {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    return (
        <div className="flex flex-col justify-between items-center h-screen">
            <TypographyH3 text={t(text)} />
            <Button className="mt-5 bg-black text-white w-96" placeholder={t('goAhead')} onClick={() => navigate(link)}>
                {t('goAhead')}
            </Button>
            <div className="flex justify-end w-screen ">
                <StandartBlueWave />
            </div>
        </div>
    );
}
