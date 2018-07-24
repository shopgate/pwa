import { ACTION_POP, ACTION_REPLACE } from '@virtuous/conductor/constants';
import { navigate } from '../../action-creators/router';
import { setRedirectLocation } from '../../action-creators/history';
import { getRedirectLocation } from '../../selectors/history';

/**
 * Redirects the user to the redirectLocation property within the history state and resets it
 * afterwards.
 * @returns {Function} A redux thunk.
 */
export default function redirectRoute() {
  return (dispatch, getState) => {
    const redirectLocation = getRedirectLocation(getState());

    // If there is a redirect location set, go to this page.
    if (redirectLocation) {
      /**
       * Redirect location MUST be nulled before replace history happens.
       * Otherwise syncHistory would abort.
       */
      dispatch(setRedirectLocation(null));
      dispatch(navigate(ACTION_REPLACE, redirectLocation));
    } else {
      // No further redirect set. Go back the previous page.
      dispatch(navigate(ACTION_POP));
    }
  };
}
