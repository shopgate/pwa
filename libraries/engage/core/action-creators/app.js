import { RELOAD_APP } from '../constants';

/**
 * Creates the RELOAD_APP Redux action object that's supposed to be dispatched
 * when the app is supposed to be reloaded.
 * @returns {Object} The Redux action object
 */
export const reloadApp = () => ({
  type: RELOAD_APP,
});
