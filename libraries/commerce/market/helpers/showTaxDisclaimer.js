import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  MARKET_AUSTRIA,
  MARKET_GERMANY,
} from '../constants';

export default [
  MARKET_AUSTRIA,
  MARKET_GERMANY,
].includes(appConfig.marketId);
