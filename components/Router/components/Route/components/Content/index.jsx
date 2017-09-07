/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { pure } from 'recompose';

/**
 * RouteContent HOC
 * @param {Object} WrappedComponent A react component.
 * @returns {JSX}
 */
const RouteContent = WrappedComponent => pure((props) => {
  const { setRef, setComponentRef, ...componentProps } = props;

  return (
    <div ref={setRef}>
      <WrappedComponent {...componentProps} ref={setComponentRef} />
    </div>
  );
});

export default RouteContent;
