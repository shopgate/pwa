import appConfig from '@shopgate/pwa-common/helpers/config';
import { MARKET_GERMANY } from '../constants';

export default [
  MARKET_GERMANY,
].includes(appConfig.marketId);
