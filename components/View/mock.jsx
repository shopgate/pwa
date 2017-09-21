/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';

/**
 * Mocked View.
 * @type {MockedView}
 */
export const MockedView = class extends Component {
  /**
   * Renders mocked view.
   * @return {JSX}
   */
  render() {
    return (
      <div>
        {this.children}
      </div>
    );
  }
};
