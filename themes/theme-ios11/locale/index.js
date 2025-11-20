import extensionTranslations from 'Extensions/translations';
import mergeTranslations from '@shopgate/pwa-common/helpers/i18n/mergeTranslations';

// eslint-disable-next-line import/no-dynamic-require
const themeTranslations = require(`./${process.env.LOCALE_FILE}.json`);
// eslint-disable-next-line import/no-dynamic-require
themeTranslations.countries = require(`@shopgate/engage/i18n/locale/${process.env.LOCALE_FILE_LOWER_CASE}/countries.json`);

export default mergeTranslations(themeTranslations, extensionTranslations);
