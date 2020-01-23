import { assignObjectDeep } from '@shopgate/pwa-common/helpers/data';
import {
  themeName,
  writeToConfig,
  appConfigArrayItemComparator,
} from '@shopgate/pwa-common/helpers/config';
import configCommon from './config-common';
import configGmd from './config-gmd';
import configIos from './config-ios';
import nmaConfig from './config';

// Write predefined configs, first: Deep merge with page and widget array item identity check.
const config = configCommon;

// Enable or disable beta mode for the themes if configured in NMA
config.beta = !!nmaConfig.beta;

if (themeName.includes('ios')) {
  assignObjectDeep(config, configIos, true, appConfigArrayItemComparator, '$');
} else {
  assignObjectDeep(config, configGmd, true, appConfigArrayItemComparator, '$');
}

// Apply NMA config by theme: Deep merge with page and widget array item identity check.
if (themeName.includes('ios')) {
  assignObjectDeep(config, { theme: nmaConfig.themeIos }, true, appConfigArrayItemComparator, '$');
} else {
  assignObjectDeep(config, { theme: nmaConfig.themeGmd }, true, appConfigArrayItemComparator, '$');
}

writeToConfig(config);

export default () => null;
