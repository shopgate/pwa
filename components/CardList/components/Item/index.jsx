/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@shopgate/pwa-common/components/List/components/Item';
import styles from './style';

/**
 * The Card List Item component implemented as class so that ref prop is available.
 */
class Item extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isSelected: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    className: null,
    isSelected: false,
  };

  /**
   * Renders a card list item.
   * @returns {JSX|null}
   */
  render() {
    if (!Children.count(this.props.children)) {
      return null;
    }

    return (
      <ListItem className={`${styles} ${this.props.className}`} isSelected={this.props.isSelected}>
        {this.props.children}
      </ListItem>
    );
  }
}

export default Item;
