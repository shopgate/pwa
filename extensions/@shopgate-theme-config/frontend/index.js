import defaultsDeep from 'lodash/defaultsDeep';
import appConfig from '@shopgate/pwa-common/helpers/config';
import configGmd from './config-gmd';
import configIos from './config-ios';

const { userAgent } = window.navigator;

appConfig.beta = true;

if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
  appConfig.theme = defaultsDeep(configIos, (appConfig.theme || {}));
} else {
  appConfig.theme = defaultsDeep(configGmd, (appConfig.theme || {}));
}

export default () => null;
