import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistState } from '@virtuous/redux-persister';
import benchmarkMiddleware from '@shopgate/pwa-benchmark/profilers/redux';
import benchmarkController from '@shopgate/pwa-benchmark';
import persistedReducers from '../collections/PersistedReducers';
import initSubscribers from '../subscriptions';
import appConfig, { themeName, shopNumber } from '../helpers/config';
import makeRootReducer from '../reducers';
import streams from './middelwares/streams';
import logger from './middelwares/logger';

/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';
const storeKey = `shopgate-connect_${shopNumber}-${themeName}_${STATE_VERSION}`;

/**
 * Returns a normalised initialState from the localstorage.
 * @returns {Object}
 */
function getInitialState() {
  if (!window.localStorage) {
    return undefined;
  }

  const storedState = window.localStorage.getItem(storeKey);

  if (!storedState) {
    return undefined;
  }

  const normalisedState = storedState.replace(new RegExp('"isFetching":true', 'g'), '"isFetching":false');
  return JSON.parse(normalisedState);
}

/**
 * Configures the redux store with all it's middleware and enhancers.
 * @param {Function} reducers The reducers from the theme.
 * @param {Array} subscribers The subscribers to the streams middleware.
 * @return {Object} The redux store.
 */
export function configureStore(reducers, subscribers) {
  // Starts benchmark controller BEFORE adding the middleware.
  if (appConfig.benchmark) {
    benchmarkController.startup();
  }

  const store = createStore(
    makeRootReducer(reducers),
    getInitialState(),
    composeWithDevTools(
      applyMiddleware(...[
        thunk,
        ...appConfig.benchmark ? [benchmarkMiddleware] : [],
        streams,
        logger,
      ]),
      persistState({
        key: storeKey,
        paths: persistedReducers.getAll(),
      })
    )
  );

  initSubscribers(subscribers);

  if (window.Cypress) {
    window.store = store;
  }

  return store;
}

/**
 * Configures a mocked store for tests.
 * @param {Function} reducers The reducers to use in the mock store.
 * @param {Array} subscribers Streams subscribers to initialize.
 * @returns {Store}
 */
export function createMockStore(reducers = () => {}, subscribers = []) {
  const store = createStore(
    reducers,
    undefined,
    applyMiddleware(thunk, streams)
  );

  if (subscribers.length !== 0) {
    initSubscribers([].concat(subscribers));
  }

  return store;
}
