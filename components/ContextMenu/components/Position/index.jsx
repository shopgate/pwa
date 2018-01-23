/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash/clamp';
import styles from './style';

/**
 * The Context Menu Position component.
 */
class Position extends Component {
  static propTypes = {
    children: PropTypes.node,
    offset: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
    }),
  };

  static defaultProps = {
    children: null,
    offset: {
      top: 0,
      left: 0,
    },
  };

  /**
   * The Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.elementRef = null;
  }

  /**
   * Calculate and apply the correct menu position after mounting.
   */
  componentDidMount() {
    const { offset } = this.props;

    // Get ref to the actual child DOM element and calculate bounding rect.
    const [child] = this.elementRef.childNodes;
    const bounds = child.getBoundingClientRect();

    // Get window dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Get the outer gap from styles
    const gap = styles.outerGap;

    // Calculate clamped menu position
    const left = clamp(offset.left, 0, width - bounds.width - (gap * 2));
    const top = clamp(offset.top - gap, 0, height - bounds.height - (gap * 2));

    // Assign position directly w/o re-rendering the component
    this.elementRef.style.left = `${left}px`;
    this.elementRef.style.top = `${top}px`;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <div ref={(ref) => { this.elementRef = ref; }} className={styles.container}>
        {this.props.children}
      </div>
    );
  }
}

export default Position;
