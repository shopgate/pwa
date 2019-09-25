import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { categoryIsReady$ } from '../streams/category';
import { searchIsReady$ } from '../streams/search';
import { productIsReady$ } from '../streams/product';
import { pagesAreReady$ } from '../streams/pages';
import { pageIsReady$ } from '../streams/page';
import { makeGetTrackingData } from '../selectors';
import { track } from '../helpers';

/**
 * Calls the pageview core tracking function.
 * @param {Object} input The input of the tracked stream.
 */
const callPageViewTracker = ({ getState }) => {
  const state = getState();
  const getTrackingData = makeGetTrackingData();

  track(
    'pageview',
    getTrackingData(state, getCurrentRoute(state)),
    state
  );
};

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function pages(subscribe) {
  subscribe(categoryIsReady$, callPageViewTracker);
  subscribe(searchIsReady$, callPageViewTracker);
  subscribe(productIsReady$, callPageViewTracker);
  subscribe(pagesAreReady$, callPageViewTracker);
  subscribe(pageIsReady$, callPageViewTracker);
}
