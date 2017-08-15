/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { render } from 'react-dom';

/**
 * A test component.
 * @return {JSX}
 */
const App = () => (
  <h1>My Awesome React Component</h1>
);

render(<App />, document.getElementById('root'));
