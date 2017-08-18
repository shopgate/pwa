/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * -------------------------------------------------------------------------
 * ATTENTION:
 * Change this file with caution.
 * Your changes may break the react application!
 * -------------------------------------------------------------------------
 */

import React from 'react';
import { render } from 'react-dom';
import onload from '@shopgate/pwa-core/commands/onload';
import { isDev } from '@shopgate/pwa-common/helpers/environment';
import Pages from './pages';

const rootEl = document.getElementById('root');

// Do HMR if we are in development mode.
if (isDev) {
  const { AppContainer } = require('react-hot-loader'); // eslint-disable-line global-require

  // Renders the application on first run.
  render(
    <AppContainer>
      <Pages />
    </AppContainer>,
    rootEl,
    onload
  );

  if (module.hot) {
    module.hot.accept('./pages', () => {
      const NextPages = require('./pages').default; // eslint-disable-line global-require

      // Renders the application on HMR injection.
      render(
        (
          <AppContainer>
            <NextPages />
          </AppContainer>
        ),
        rootEl
      );
    });
  }
} else {
  // Render without HMR.
  render(
    <Pages />,
    rootEl,
    onload
  );
}
