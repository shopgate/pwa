import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
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
      applyMiddleware(thunk, streams, logger),
      persistState({
        key: storeKey,
        paths: persistedReducers.getAll(),
      })
    )
  );

  initSubscribers(subscribers);
  syncRouter(store);

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
