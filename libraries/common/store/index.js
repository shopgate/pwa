import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { applyWorker } from 'redux-worker';
import { initPersistentStorage } from './persistent';
import streams from './middelwares/streams';
import logger from './middelwares/logger';

/**
 * Configures the redux store with all it's middleware and enhancers.
 * @param {Function} reducers The reducers from the theme.
 * @param {Function} Worker The web worker.
 * @return {Object} The redux store.
 */
const configureStore = (reducers, Worker) => createStore(
  reducers, // The reducers.
  initPersistentStorage(), // The peristent store from localstorage / indexedDb
  composeWithDevTools(
    applyMiddleware(thunk, streams, logger),
    applyWorker(new Worker())
  )
);

export default configureStore;
