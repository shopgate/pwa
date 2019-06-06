import defaultsDeep from 'lodash/defaultsDeep';
import { themeName, writeToConfig } from '@shopgate/pwa-common/helpers/config';
import configCommon from './config-common';
import configGmd from './config-gmd';
import configIos from './config-ios';
import nmaConfig from './config';

let config = configCommon;
if (themeName.includes('ios')) {
  config = defaultsDeep(configIos, config);
} else {
  config = defaultsDeep(configGmd, config);
}

writeToConfig(config);

// Apply NMA config theme dependend
// -> Second write, because it safely merges pages and their subsequent widget list
if (themeName.includes('ios')) {
  writeToConfig({ theme: nmaConfig.themeIos });
} else {
  writeToConfig({ theme: nmaConfig.themeGmd });
}

export default () => null;
