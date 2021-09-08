import appConfig from '@shopgate/pwa-common/helpers/config';
import showModalAction from '@shopgate/pwa-common/actions/modal/showModal';
import { TIMER_TIMESPAN } from '../constants';
import { increaseRejectionCount, setLastPopupTimestamp } from '../action-creators/popup';
import { useNavigation } from '../../core';
import { getPlatform } from '../../../common/selectors/client';

const {
  appRating: {
    minTimeBetweenPopups,
    bundleId: bId,
    rejectionLink,
  },
} = appConfig;

/**
 * Generates a review app deep link based on the given provider
 * @param {string} bundleId app bundle id
 * @param {'android' | 'ios'} provider the name of the provider
 * @return {string | null}
 */
export function generateReviewLink(bundleId, provider) {
  if (!bundleId) {
    return null;
  }

  switch (provider) {
    case 'ios': {
      return `https://itunes.apple.com/app/id${bundleId}?action=write-review`;
    }
    case 'android': {
      return `https://market.android.com/details?id=${bundleId}`;
    }
    default: {
      return null;
    }
  }
}

/**
 * check if the time between popups has been elapsed
 * @param {Object} state the state object
 * @return {boolean}
 */
export function isMinTimeBetweenPopupsElapsed(state) {
  return (Date.now() - state.lastPopupAt) >=
  (minTimeBetweenPopups * TIMER_TIMESPAN);
}

/**
 * shows the actual modal
 * @param {Object} state the state object
 * @param {Function} dispatch the dispatch function
 * @param {Function} resetAction the reset action function
 */
export function showModal(state, dispatch, resetAction) {
  dispatch(resetAction());
  dispatch(setLastPopupTimestamp());

  dispatch(showModalAction({
    confirm: 'appRating.yes',
    dismiss: 'appRating.no',
    title: 'appRating.title',
    message: 'appRating.message',
  })).then((confirmed) => {
    const { push } = useNavigation();

    // user touched yes and we
    // redirect to store
    if (confirmed) {
      const platform = getPlatform(state);
      const link = generateReviewLink(bId[platform], platform);
      if (!link) {
        return;
      }
      push({
        pathname: link,
      });
      return;
    }

    // user doesn't want to rate
    dispatch(increaseRejectionCount());
    if (rejectionLink) {
      push({
        pathname: rejectionLink,
      });
    }
  });
}
