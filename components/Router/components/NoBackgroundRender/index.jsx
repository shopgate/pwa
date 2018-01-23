/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';

/**
 * HOC that will make sure to not re-render a view that is in the background.
 * @param {Object} WrappedComponent The component that should be wrapped.
 * @param {string} action The view action.
 * @returns {Object}
 */
const NoBackgroundRender = (WrappedComponent, action) => class extends Component {
  /**
   * Whenever the view is in background updates should not be triggered.
   * @param {Object} nextProps The props the component will recieve after the update.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.pathname.includes(action, 1);
  }

  /**
   * Returns the actual wrapped
   * @returns {Object}
   */
  getWrappedInstance() {
    return this.myRef;
  }

  /**
   * Renders the wrapped component and passes all props.
   * @returns {JSX}
   */
  render() {
    return (
      <WrappedComponent {...this.props} ref={(element) => { this.myRef = element; }} />
    );
  }
};

export default NoBackgroundRender;
