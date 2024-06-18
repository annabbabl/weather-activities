import { Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../constants/i18next'

/**
 
 */

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div style={{ textAlign: 'center', marginTop: '10%' }}>
            <Typography variant="h2" placeholder={t('noFound')}>
                {t('noFound')}
            </Typography>
            <Typography variant="h6" placeholder={t('sorryNotFound')}>
                {t('sorryNotFound')}
            </Typography>
            <Typography variant="h6" placeholder={t('sorryNotFound')}>
                {t('pleaseGo')}
            </Typography>
            <Link to="/" style={{ color: 'blue' }}>{t("homepage")}</Link>
        </div>
    );
};

export default NotFoundPage;