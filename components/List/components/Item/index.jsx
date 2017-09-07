/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The list item component.
 */
class ListItem extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isSelected: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    children: null,
    isSelected: false,
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (!React.Children.count(this.props.children)) {
      return null;
    }

    let classes = styles.item;

    if (this.props.className) {
      classes += ` ${this.props.className}`;
    }

    // Add selected or unselected styling.
    classes += ` ${this.props.isSelected ? styles.selected : styles.unselected}`;

    return <li className={classes}>{this.props.children}</li>;
  }
}

export default ListItem;
