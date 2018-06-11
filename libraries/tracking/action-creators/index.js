import { PWA_DID_APPEAR } from '../constants';

/**
 * Creates the dispatched PWA_DID_APPEAR action object.
 * @return {Object} The dispatched action object.
 */
export const pwaDidAppear = () => ({
  type: PWA_DID_APPEAR,
});
