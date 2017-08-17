/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { render } from 'react-dom';

const rootEl = document.getElementById('root');

// Do HMR if we are in development mode.
if (isDev) {
  const { AppContainer } = require('react-hot-loader'); // eslint-disable-line global-require

  // Renders the application on first run.
  render(
    <AppContainer>
      <Routes />
    </AppContainer>,
    rootEl,
    onload
  );

  if (module.hot) {
    module.hot.accept('Templates/Routes', () => {
      const NextMain = require('Templates/Routes').default; // eslint-disable-line global-require

      // Renders the application on HMR injection.
      render(
        <AppContainer>
          <NextMain />
        </AppContainer>,
        rootEl
      );
    });
  }
} else {
  // Render without HMR.
  render(
    <Routes />,
    rootEl,
    onload
  );
}
