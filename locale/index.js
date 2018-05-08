import extensionTranslations from 'Extensions/translations';
import mergeTranslations from '@shopgate/pwa-common/helpers/i18n/mergeTranslations';

// eslint-disable-next-line import/no-dynamic-require
const themeTranslations = require(`./${process.env.LOCALE_FILE}.json`);

export default mergeTranslations(themeTranslations, extensionTranslations);
