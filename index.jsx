/**
 * -------------------------------------------------------------------------
 * ATTENTION:
 * Change this file with caution.
 * Your changes may break the react application!
 * -------------------------------------------------------------------------
 */
import '@shopgate/pwa-common/styles/reset';
import 'Extensions/portals';
import React from 'react';
import { render } from 'react-dom';
import { configureStore } from '@shopgate/pwa-common/store';
import { appWillStart } from '@shopgate/pwa-common/action-creators/app';
import fetchClientInformation from '@shopgate/pwa-common/actions/client/fetchClientInformation';
import smoothscroll from 'smoothscroll-polyfill';
import reducers from './pages/reducers';
import subscribers from './pages/subscribers';
import Pages from './pages';

smoothscroll.polyfill();

const store = configureStore(reducers, subscribers);

store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));
store.dispatch(fetchClientInformation());

render(<Pages store={store} />, document.getElementById('root'));
