/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
/**
 * Mocked AddToCartButton.
 * @type {MockedAddToCartButton}
 */
// eslint-disable-next-line react/prefer-stateless-function
export const MockedAddToCartButton = class extends Component {
  static propTypes = {
    handleAddToCart: PropTypes.func,
  };
  static defaultProps = {
    handleAddToCart: () => {},
  };
  /**
   * Renders mocked button.
   * @return {JSX}
   */
  render() {
    return (
      <button onClick={this.props.handleAddToCart} />
    );
  }
};
