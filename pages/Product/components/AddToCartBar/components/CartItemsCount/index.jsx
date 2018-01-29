/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckIcon from 'Components/icons/CheckIcon';
import Count from './components/Count';
import connect from './connector';
import styles from './style';

/**
 * The cart items count component.
 * @extends Component
 */
class CartItemsCount extends Component {
  static propTypes = {
    cartProductCount: PropTypes.number.isRequired,
  };

  /**
   * Only update if the cart product count changed.
   * @param {Object} nextProps The next props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (this.props.cartProductCount !== nextProps.cartProductCount);
  }

  /**
   * Renders the component
   * @return {[type]} [description]
   */
  render() {
    const { cartProductCount } = this.props;

    if (!cartProductCount) {
      return null;
    }

    return (
      <div className={styles.container}>
        <div className={styles.check}>
          <CheckIcon />
        </div>
        <Count count={cartProductCount} animation={styles.animateIn} />
      </div>
    );
  }
}

export default connect(CartItemsCount);
