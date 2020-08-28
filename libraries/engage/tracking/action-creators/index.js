import { INITIALIZE_TRACKING } from '../constants';

/**
 * Creates the dispatched INITIALIZE_TRACKING action object.
 * @returns {Object} The dispatched action object.
 */
export const initTracking = () => ({
  type: INITIALIZE_TRACKING,
});
