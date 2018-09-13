import configureStore from '@shopgate/pwa-common/store';
import productReducers from '@shopgate/pwa-common-commerce/product/reducers';
import { HISTORY_PUSH_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import { updateHistory } from '@shopgate/pwa-common/action-creators/history';

/*
let mockedInitialPathname;
jest.mock('history/createBrowserHistory', () => () => ({
  location: {
    get pathname() { return mockedInitialPathname; },
  },
}));
*/
jest.mock('redux-logger', () => ({
  createLogger: () => () => next => action => next(action),
}));

/**
 * Creates a redux store instance for the tests.
 * @param {string} pathname The initial pathname.
 * @return {Onject}
 */
export const createStore = (pathname = '/somepath') => {
  // eslint-disable-next-line no-undef
  mockedInitialPathname = pathname;
  return configureStore({
    product: productReducers,
  });
};

/**
 * A wrapper for the updated history action creator. It sets up the most common properties.
 * @param {string} pathname The pathname for the update.
 * @return {Object}
 */
export const updateHistoryWrapped = (pathname = '/somepath') => updateHistory({
  action: HISTORY_PUSH_ACTION,
  queryParams: {},
  length: 1,
  pathname,
});
