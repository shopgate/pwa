/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys } from 'recompose';
import styles from './style';

/**
 * The main view component.
 */
class View extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    children: null,
    style: null,
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div className={styles} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default onlyUpdateForKeys(['style', 'children'])(View);
