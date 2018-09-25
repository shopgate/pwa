<<<<<<< HEAD
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
=======
import { logger, hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import benchmarkMiddleware from '@shopgate/pwa-benchmark/profilers/redux';
import { createStore, applyMiddleware, compose } from 'redux';
>>>>>>> 3c1b70ae238263b62105227af1304b08a1a5b29f
import thunk from 'redux-thunk';
import benchmarkMiddleware from '@shopgate/pwa-benchmark/profilers/redux';
import { persistState } from '@virtuous/redux-persister';
import syncRouter from '@virtuous/redux-conductor';
import persistedReducers from '../collections/PersistedReducers';
import initSubscribers from '../subscriptions';
import streams from './middelwares/streams';
import logger from './middelwares/logger';

/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';
const storeKey = `shopgate-connect_${STATE_VERSION}`;

let initialState;

if (window.localStorage) {
  initialState = JSON.parse(window.localStorage.getItem(storeKey));
}

/**
 * Configures the redux store with all it's middleware and enhancers.
 * @param {Function} reducers The reducers from the theme.
 * @param {Array} subscribers The subscribers to the streams middleware.
 * @return {Object} The redux store.
 */
export function configureStore(reducers, subscribers) {
  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunk, benchmarkMiddleware, streams, logger),
      persistState({
        key: storeKey,
        paths: persistedReducers.getAll(),
      })
    )
  );

<<<<<<< HEAD
  initSubscribers(subscribers);
  syncRouter(store);
=======
  // Add benchmark middleware if enabled via app config.
  const { benchmark = false } = process.env.APP_CONFIG || {};
  if (benchmark) {
    middleware.push(benchmarkMiddleware);
  }

  // Add observable middleware.
  middleware.push(observableMiddleware);
>>>>>>> 3c1b70ae238263b62105227af1304b08a1a5b29f

  return store;
}

/**
 * Configures a mocked store for tests.
 * @param {Function} reducers The reducers to use in the mock store.
 * @param {Function|Array} subscribers Streams subscribers to initialize.
 * @returns {Store}
 */
export function createMockStore(reducers = () => {}, subscribers = null) {
  const store = createStore(
    reducers,
    undefined,
    applyMiddleware(thunk, streams)
  );

  if (subscribers !== null) {
    initSubscribers([].concat(subscribers));
  }

  return store;
}
