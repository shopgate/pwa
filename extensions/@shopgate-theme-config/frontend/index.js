import { assignObjectDeep } from '@shopgate/pwa-common/helpers/data';
import {
  writeToConfig,
  appConfigArrayItemComparator,
} from '@shopgate/pwa-common/helpers/config';
import configCommon from './config-common';
import configIos from './config-ios';
import nmaConfig from './config.json';

// Write predefined configs, first: Deep merge with page and widget array item identity check.
const config = configCommon;

// Enable or disable beta mode for the theme if configured in NMA
config.beta = !!nmaConfig.beta;

assignObjectDeep(config, configIos, true, appConfigArrayItemComparator, '$');

// Apply NMA config: Deep merge with page and widget array item identity check.
assignObjectDeep(config, { theme: nmaConfig.themeIos }, true, appConfigArrayItemComparator, '$');

writeToConfig(config);

export default () => null;
