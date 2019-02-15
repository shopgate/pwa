import {
  PWA_DID_APPEAR,
  PWA_DID_DISAPPEAR,
} from '../constants';

/**
 * Creates the dispatched PWA_DID_APPEAR action object.
 * @return {Object} The dispatched action object.
 */
export const pwaDidAppear = () => ({
  type: PWA_DID_APPEAR,
});

/**
 * Creates the dispatched PWA_DID_DISAPPEAR action
 * @return {Object} The dispatched action object.
 */
export const pwaDidDisappear = () => ({
  type: PWA_DID_DISAPPEAR,
});
