/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MagnifierIcon from 'Components/icons/MagnifierIcon';
import Ripple from 'Components/Ripple';
import styles from './style';

/**
 * The search button component.
 */
class SearchButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick: () => {},
  };

  /**
   * This component doesn't need to update at all.
   * @returns {boolean}
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <button className={styles.button} onClick={this.props.onClick}>
        <Ripple className={styles.buttonContent}>
          <MagnifierIcon />
        </Ripple>
      </button>
    );
  }
}

export default SearchButton;
