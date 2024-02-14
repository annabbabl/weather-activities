/* eslint-disable jsx-a11y/img-redundant-alt */
import {
    Typography,
  } from "@material-tailwind/react";
import '../constants/i18next'
import { useTranslation } from "react-i18next";
import { StandartBlueWave } from "../components/shared/waves";
import { ParallaxProvider, useParallax } from 'react-scroll-parallax';

interface ComponentProps {
    text:string
    startPos: number
    endPos: number
}

function Component({ text, startPos, endPos }: ComponentProps): JSX.Element {
    const parallax = useParallax<HTMLDivElement>({
      easing: 'easeOutQuad',
      translateX: [startPos, endPos],
    });
    return (
        <div ref={parallax.ref} className="w-5/6 text-left mt-48 ">
            <Typography variant="paragraph" className="text-blue-700 text-5xl" placeholder="description" textGradient >
                {text}
            </Typography>
            <StandartBlueWave />
        </div>
    );
}

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <div className='mt-12 mb-5 w-5/6 flex flex-col items-center '>
            <Typography  className="text-blue-700 text-8xl font-extrabold" placeholder={t('username')}>
                    {t('about')}
            </Typography>
            <ParallaxProvider >    
                <Component text={t('infoText')} startPos={-20} endPos={15} />
                <Component text={t('aboutMeText')} startPos={0} endPos={30}/>
            </ParallaxProvider>
        </div>
    );
}