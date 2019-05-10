import defaultsDeep from 'lodash/defaultsDeep';
import { themeName, writeToConfig } from '@shopgate/pwa-common/helpers/config';
import configCommon from './config-common';
import configGmd from './config-gmd';
import configIos from './config-ios';

let config = configCommon;
if (themeName.includes('ios')) {
  config = defaultsDeep(configIos, config);
} else {
  config = defaultsDeep(configGmd, config);
}

writeToConfig(config);

export default () => null;
