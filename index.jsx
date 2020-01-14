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
import { i18n } from '@shopgate/engage/core';
import smoothscroll from 'smoothscroll-polyfill';
import fetchClientInformation from '@shopgate/pwa-common/actions/client/fetchClientInformation';
import appConfig from '@shopgate/pwa-common/helpers/config';
import locales from './locale';
import reducers from './pages/reducers';
import subscribers from './pages/subscribers';
import Pages from './pages';

const { locales: { currency: currencyLocale = null } = {} } = appConfig;

i18n.init({
  locales,
  lang: process.env.LOCALE,
  currencyLocale,
});

smoothscroll.polyfill();

const store = configureStore(reducers, subscribers);

store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));
store.dispatch(fetchClientInformation());

render(<Pages store={store} />, document.getElementById('root'));
