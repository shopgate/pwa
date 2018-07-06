import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistState } from '@virtuous/redux-persister';
import { applyWorker } from 'redux-worker';
import streams from './middelwares/streams';
import logger from './middelwares/logger';

/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';
export const storeKey = `shopgate-connect_${STATE_VERSION}`;

let initialState;

if (window.localStorage) {
  initialState = JSON.parse(window.localStorage.getItem(storeKey));
}

/**
 * Configures the redux store with all it's middleware and enhancers.
 * @param {Function} reducers The reducers from the theme.
 * @param {Function} Worker The web worker.
 * @return {Object} The redux store.
 */
const configureStore = (reducers, Worker) => createStore(
  reducers, // The reducers.
  initialState,
  composeWithDevTools(
    applyMiddleware(thunk, streams, logger),
    applyWorker(new Worker()),
    persistState({
      key: storeKey,
      paths: [
        'cart',
        'client',
        'page',
        'url',
        'user',
      ],
    })
  )
);

export default configureStore;
