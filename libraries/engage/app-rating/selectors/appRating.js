import { createSelector } from 'reselect';
import appConfig from '@shopgate/pwa-common/helpers/config';

const {
  appRating: {
    rejectionMaxCount,
  },
} = appConfig;

/**
 * Selects the app rating information.
 * @param {Object} state The current state.
 * @returns {Object} The app rating information.
 */
export default createSelector((state) => {
  if (state.rejectionCount >= rejectionMaxCount) {
    return null;
  }
  return state.appRating;
}, rating => rating);
