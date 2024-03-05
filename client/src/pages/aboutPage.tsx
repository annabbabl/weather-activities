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


/**
 * A Parallax Component that animates elements based on scroll position.
 * This component uses 'react-scroll-parallax' to apply a horizontal parallax effect to the text content.
 * 
 * @component
 * @param {ComponentProps} props - The properties passed to the Component.
 * @param {string} props.text - The text content to be displayed and animated in the component.
 * @param {number} props.startPos - The starting position for the horizontal translation during the scroll.
 * @param {number} props.endPos - The ending position for the horizontal translation during the scroll.
 * @returns {JSX.Element} A div element containing the animated text content.
 *
 * @example
 * <Component text="Hello, world!" startPos={-20} endPos={20} />
 */
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

/**
 * The About Page component that displays information about the website or user.
 * This page utilizes a Parallax effect to create a more dynamic viewing experience.
 * Text information on this page is internationalized to support multiple languages.
 *
 * @component
 * @example
 * <AboutPage />
 *
 * @returns {React.ReactElement} A React component representing the about page of the website.
 */
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