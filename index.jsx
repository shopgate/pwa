/**
 * -------------------------------------------------------------------------
 * ATTENTION:
 * Change this file with caution.
 * Your changes may break the react application!
 * -------------------------------------------------------------------------
 */
import '@shopgate/pwa-common/styles/reset';
import 'Styles/fonts';
import 'Extensions/portals';
import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { configureStore } from '@shopgate/pwa-common/store';
import initSubscribers from '@shopgate/pwa-common/subscriptions';
import { appWillStart } from '@shopgate/pwa-common/action-creators/app';
import smoothscrollPolyfill from '@shopgate/pwa-common/helpers/scrollPolyfill';
import fetchClientInformation from '@shopgate/pwa-common/actions/client/fetchClientInformation';
import syncRouter from '@virtuous/redux-conductor';
import Pages from './pages';
import reducers from './pages/reducers';
import Worker from './pages/worker';
import subscribers from './pages/subscribers';

injectTapEventPlugin();
smoothscrollPolyfill();
initSubscribers(subscribers);

const store = configureStore(reducers, new Worker());
syncRouter(store);

store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));
store.dispatch(fetchClientInformation());

render(<Pages store={store} />, document.getElementById('root'));
