import defaultsDeep from 'lodash/defaultsDeep';
import appConfig, { themeName } from '@shopgate/pwa-common/helpers/config';
import configGmd from './config-gmd';
import configIos from './config-ios';

appConfig.beta = true;

if (themeName.includes('ios')) {
  appConfig.theme = defaultsDeep(configIos, (appConfig.theme || {}));
} else {
  appConfig.theme = defaultsDeep(configGmd, (appConfig.theme || {}));
}

export default () => null;
