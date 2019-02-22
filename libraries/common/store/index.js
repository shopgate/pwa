import { logger, hasSGJavaScriptBridge } from '@shopgate/pwa-core/helpers';
import benchmarkMiddleware from '@shopgate/pwa-benchmark/profilers/redux';
import benchmarkController from '@shopgate/pwa-benchmark';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import appConfig from '../helpers/config';
import { isDev, isRemote } from '../helpers/environment';
import reducers from '../reducers';
import observableMiddleware from './observable-middleware';
import { initPersistentStorage } from './persistent';

let composeEnhancers = compose;

/**
 * Used to enable the Redux DevTools Extension in the browser in development mode.
 */
// eslint-disable-next-line no-underscore-dangle
logger.info('-----------------------------------------------------', 'JSBridge:', hasSGJavaScriptBridge(), 'isDev:', isDev, 'isRemote', isRemote, 'process:', process, 'appConfig:', appConfig, 'redux-devtools:', window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__, '-----------------------------------------------------');
// -- if (isDev) {
if (hasSGJavaScriptBridge()) {
  const { composeWithDevTools } = require('remote-redux-devtools'); // eslint-disable-line global-require
  // Use the Remote DevTools if we are inside the app.
  const reduxDevToolsOptions = {
    name: `${appConfig.shopName || 'PWA'} App - remote`,
    realtime: true,
    hostname: process.env.IP,
    port: 8008,
  };
  composeEnhancers = composeWithDevTools(reduxDevToolsOptions);
  logger.info(`Attached Redux Remote DevTools to host ${reduxDevToolsOptions.hostname}:`
    + `${reduxDevToolsOptions.port}. Open Inspector->Redux and select instance `
    + `"${reduxDevToolsOptions.name}" to inspect redux store.`);
} else {
  const { composeWithDevTools } = require('redux-devtools-extension'); // eslint-disable-line global-require
  // Use the browser Redux DevTools extension.
  const reduxDevToolsOptions = { name: `${appConfig.shopName || 'PWA'} App - local` };
  composeEnhancers = composeWithDevTools(reduxDevToolsOptions);
  logger.info('Attached Redux DevTools. Open Inspector->Redux and select '
    + `instance "${reduxDevToolsOptions.name}" to inspect redux store.`);
}
// }

/**
 * Configures the redux store with all it's middleware and enhancers.
 * @param {Object} customReducers The custom reducers from the theme.
 * @return {Object} The redux store.
 */
const configureStore = (customReducers = {}) => {
  const middleware = [thunk];

  // Add benchmark middleware if enabled via app config.
  if (appConfig.benchmark) {
    benchmarkController.startup();
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
