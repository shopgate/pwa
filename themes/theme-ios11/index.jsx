/**
 * -------------------------------------------------------------------------
 * ATTENTION:
 * Change this file with caution.
 * Your changes may break the react application!
 * -------------------------------------------------------------------------
 */
import '@shopgate/pwa-common/styles/reset';
import React from 'react';
import { render } from 'react-dom';
import { configureStore } from '@shopgate/pwa-common/store';
import { appWillStart } from '@shopgate/pwa-common/action-creators/app';
import fetchClientInformation from '@shopgate/pwa-common/actions/client/fetchClientInformation';
import { i18n } from '@shopgate/engage/core';
import appConfig from '@shopgate/pwa-common/helpers/config';
import smoothscroll from 'smoothscroll-polyfill';
import locales from './locale';
import reducers from './pages/reducers';
import subscribers from './pages/subscribers';
import Pages from './pages';

const { locales: { price: priceLocale = null } = {} } = appConfig;

i18n.init({
  locales,
  lang: process.env.LOCALE,
  priceLocale,
});

smoothscroll.polyfill();

const store = configureStore(reducers, subscribers);

store.dispatch(appWillStart(`${window.location.pathname}${window.location.search}`));
store.dispatch(fetchClientInformation());

render(<Pages store={store} />, document.getElementById('root'));
