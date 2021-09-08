import appConfig from '@shopgate/pwa-common/helpers/config';
import { TIMER_TIMESPAN } from '../constants';
import { getAppRatingState } from '../selectors/appRating';

const {
  appRating: {
    minTimeBetweenPopups,
  },
} = appConfig;

/**
 * check if the time between popups has been elapsed
 * @return {Promise<function(*, *): boolean>}
 */
export async function isMinTimeBetweenPopupsElapsed() {
  return (dispatch, getState) => {
    const state = getAppRatingState(getState());

    return (Date.now() - state.lastPopupAt) >=
    (minTimeBetweenPopups * TIMER_TIMESPAN);
  };
}
