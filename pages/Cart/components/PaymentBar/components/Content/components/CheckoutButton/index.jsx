/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import I18n from '@shopgate/pwa-common/components/I18n';
import RippleButton from 'Components/RippleButton';
import connect from './connector';

/**
 * The checkout button component.
 */
class CheckoutButton extends Component {
  static propTypes = {
    pushHistory: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    isActive: true,
  };

  static clickDelay = 300;

  /**
   * Go to the checkout
   */
  handleClick = () => {
    setTimeout(() => this.props.pushHistory(CHECKOUT_PATH), CheckoutButton.clickDelay);
  };

  /**
   * The render function.
   * @returns {JSX}
   */
  render() {
    return (
      <RippleButton
        onClick={this.handleClick}
        disabled={!this.props.isActive}
        flat={false}
        type="secondary"
      >
        <I18n.Text string="cart.checkout" />
      </RippleButton>
    );
  }
}

export default connect(CheckoutButton);
