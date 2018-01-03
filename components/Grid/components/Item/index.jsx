/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { objectWithoutProps } from '../../../../helpers/data';

import styles from './style';

/**
 * The grid item component.
 */
class GridItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    component: PropTypes.string,
    grow: PropTypes.number,
    shrink: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    component: 'li',
    grow: 0,
    shrink: 1,
  };

  /**
   * Composes the props.
   * @returns {Object} The composed props.
   */
  getProps() {
    let { className } = this.props;

    if (this.props.grow !== 0) {
      className += ` ${styles.grow(this.props.grow)}`;
    }

    if (this.props.shrink !== 1) {
      className += ` ${styles.shrink(this.props.shrink)}`;
    }

    const props = {
      ...this.props,
      className,
    };

    return objectWithoutProps(props, [
      'component',
      'grow',
      'shrink',
    ]);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return React.createElement(this.props.component, this.getProps());
  }
}

export default GridItem;
