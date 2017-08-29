/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Transition from 'react-transition-group/Transition';
import { getAbsoluteHeight } from '@shopgate/pwa-common/helpers/dom';
import CardList from 'Components/CardList';
import {
  cartItemTransitionDuration as duration,
  getCartItemTransitionStyle as getTransitionStyle,
} from '../../../../style';
import connect from './connector';
import Layout from './components/Layout';

/**
 * The Coupon component.
 */
class Coupon extends Component {
  static propTypes = {
    coupon: PropTypes.shape().isRequired,
    currency: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    deleteCoupon: PropTypes.func,
  };

  static defaultProps = {
    deleteCoupon: () => {},
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  /**
   * We need to set the element height explicitly so that we can animate it later.
   */
  componentDidMount() {
    this.transitionElement.style.height = `${getAbsoluteHeight(findDOMNode(this.cardElement))}px`;
  }

  /**
   * Sets this coupon to be invisible via its state.
   */
  transitionOut = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * Deletes the coupon from the cart.
   */
  deleteCoupon = () => {
    this.props.deleteCoupon(this.props.id);
  };

  /**
   * Render Function.
   * @returns {JSX}
   */
  render() {
    return (
      <Transition in={this.state.visible} timeout={duration} onExited={this.deleteCoupon}>
        {state => (
          <div
            ref={(element) => { this.transitionElement = element; }}
            key={this.props.id}
            style={getTransitionStyle(state)}
          >
            <CardList.Item ref={(element) => { this.cardElement = element; }}>
              <Layout
                handleDelete={this.transitionOut}
                coupon={this.props.coupon}
                currency={this.props.currency}
              />
            </CardList.Item>
          </div>
        )}
      </Transition>
    );
  }
}

export default connect(Coupon);
