import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistState } from '@virtuous/redux-persister';
import { applyWorker } from '@virtuous/redux-web-worker';
import persistedReducers from '../collections/PersistedReducers';
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
 * @param {WebWorker} worker The web worker.
 * @return {Object} The redux store.
 */
export function configureStore(reducers, worker) {
  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunk, streams, logger),
      applyWorker(worker),
      persistState({
        key: storeKey,
        paths: persistedReducers.getAll(),
      })
    )
  );

  return store;
}

export default configureStore;
