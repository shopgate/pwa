import extensionTranslations from 'Extensions/translations';
import mergeTranslations from '@shopgate/pwa-common/helpers/i18n/mergeTranslations';

const locale = process.env.LOCALE_FILE;
// eslint-disable-next-line import/no-dynamic-require
const themeTranslations = require(`./${locale}.json`);
// eslint-disable-next-line import/no-dynamic-require
themeTranslations.countries = require(`@shopgate/engage/i18n/locale/${locale.toLowerCase()}/countries.json`);

export default mergeTranslations(themeTranslations, extensionTranslations);
