/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddToCartButton from './components/AddToCartButton';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartBar component.}
 */
class AddToCartBar extends Component {
  static propTypes = {
    isOrderable: PropTypes.bool.isRequired,
    cartProductCount: PropTypes.number,
  };

  static defaultProps = {
    cartProductCount: 0,
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return [
      <div className={styles.container} key="bar">
        <div className={styles.ctaContainer}>
          <AddToCartButton />
        </div>
      </div>,
      <div className={styles.dummy} key="dummy" />,
    ];
  }
}

export default connect(AddToCartBar);
