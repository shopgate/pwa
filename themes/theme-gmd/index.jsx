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
import smoothscroll from 'smoothscroll-polyfill';
import { initialize } from '@shopgate/engage/core';
import locales from './locale';
import reducers from './pages/reducers';
import subscribers from './pages/subscribers';
import Pages from './pages';

(async () => {
  const { store } = await initialize(locales, reducers, subscribers);
  smoothscroll.polyfill();
  render(<Pages store={store} />, document.getElementById('root'));
})();
