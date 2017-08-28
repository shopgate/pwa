/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import BaseList from '@shopgate/pwa-common/components/List';
import Item from './components/Item';

/**
 * The main card list component.
 */
class CardList extends Component {
  static Item = Item;

  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { children } = this.props;

    if (!Children.count(children)) {
      return null;
    }

    return (
      <BaseList>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) {
            return null;
          }

          return child;
        })}
      </BaseList>
    );
  }
}

export default CardList;
