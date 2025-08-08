import { REFRESH_EXPIRED_PDP_DATA } from '../constants';

/**
 * Creates the dispatched REFRESH_EXPIRED_PDP_DATA action object.
 * When this action is dispatched, PDP subscriptions to fetch basic product data are re-triggered.
 * @return {Object} The REFRESH_EXPIRED_PDP_DATA action.
 */
const refreshExpiredPDPData = () => ({
  type: REFRESH_EXPIRED_PDP_DATA,
});

export default refreshExpiredPDPData;
