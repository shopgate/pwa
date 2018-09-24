import { logger, hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import benchmarkMiddleware from '@shopgate/pwa-benchmark/profilers/redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { isDev, isRemote } from '../helpers/environment';
import reducers from '../reducers';
import observableMiddleware from './observable-middleware';
import { initPersistentStorage } from './persistent';

let composeEnhancers = compose;

/**
 * Used to enable the Redux DevTools Extension in the browser in development mode.
 */
if (isDev) {
  if (hasSGJavaScriptBridge() && isRemote) {
    const { composeWithDevTools } = require('remote-redux-devtools'); // eslint-disable-line global-require
    // Use the Remote DevTools if we are inside the app.
    composeEnhancers = composeWithDevTools({
      name: 'Shopgate App',
      realtime: true,
      hostname: process.env.IP,
      port: 8008,
    });
  // eslint-disable-next-line no-underscore-dangle
  } else if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    // Use the browsers DevTools Extension.
    // eslint-disable-next-line no-underscore-dangle
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }
}

/**
 * Configures the redux store with all it's middleware and enhancers.
 * @param {Object} customReducers The custom reducers from the theme.
 * @return {Object} The redux store.
 */
const configureStore = (customReducers = {}) => {
  const middleware = [thunk];

  // Add benchmark middleware if enabled via app config.
  const { benchmark = false } = process.env.APP_CONFIG || {};
  if (benchmark) {
    middleware.push(benchmarkMiddleware);
  }

  // Add observable middleware.
  middleware.push(observableMiddleware);

  // Add logger to middleware.
  middleware.push(createLogger({
    logger,
    collapsed: true,
    duration: true,
  }));

  const store = createStore(
    // Append the reducers.
    reducers(customReducers),
    // Append the pre-loaded state.
    initPersistentStorage(),
    // Compose the enhancers.
    composeEnhancers(applyMiddleware(...middleware))
  );

  // Do the HMR only if in development mode.
  if (isDev && module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('../reducers', () => {
      const nextReducers = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(() => nextReducers(customReducers));
    });
  }

  return store;
};

export default configureStore;
