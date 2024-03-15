import { Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../constants/i18next'

/**
 * Functional React component for displaying a 404 Not Found page.
 * This component is displayed when a user navigates to a route that does not exist in the application.
 * It provides a user-friendly message indicating the page could not be found and offers a link to return to the homepage.
 * This helps in maintaining the user experience by guiding users back to a valid page.
 * 
 * @component
 * @example
 * <NotFoundPage />
 *
 * @returns {React.ReactElement} A React component for displaying the not found message and link to the homepage.
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