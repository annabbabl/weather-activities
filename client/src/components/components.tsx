import { useTranslation } from "react-i18next";
import {

    Typography,
} from "@material-tailwind/react";
import { color } from "@material-tailwind/react/types/components/typography";


interface TypographyProps {
    text?: string | null; 
    variant: "paragraph" | "h2" | "h3" | "h6"| "h5"; 
    classNameString?: string | undefined; 
    color?: color; 
}

const TypographyElements: React.FC<TypographyProps> = ({text, variant, classNameString, color}) => {
    const { t } = useTranslation();
    const txt = text ? text : ""

    return (
        <Typography variant={variant} placeholder={t(txt)} textGradient className={classNameString} color={color}>
            {t(txt)}
        </Typography>
    );
};
export const TypographyParagraph: React.FC<Omit<TypographyProps, 'variant' | 'classNameString'>> = (props) => (
    <TypographyElements variant="paragraph" classNameString="text-leftblue-700 text-left" {...props} />
);
export const TypographyH2: React.FC<Omit<TypographyProps, 'variant' | 'classNameString'>> = (props) => (
    <TypographyElements variant="h2" classNameString="text-leftblue-700 mb-2 mt-6 text-left" {...props} />
);
export const TypographyH3: React.FC<Omit<TypographyProps, 'variant' | 'classNameString'>> = (props) => (
    <TypographyElements variant="h3" classNameString="text-leftblue-700  mb-4 mt-6 text-left" {...props} />
);
export const TypographyH5: React.FC<Omit<TypographyProps, 'variant' | 'classNameString'>> = (props) => (
    <TypographyElements variant="h5"  color="blue-gray" {...props} />
);
export const TypographyH6: React.FC<Omit<TypographyProps, 'variant' | 'classNameString'>> = (props) => (
    <TypographyElements variant="h6"  color="blue-gray" {...props} />
);


