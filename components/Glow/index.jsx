/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import colors from 'Styles/colors';
import styles from './style';

/**
 * Renders a glowing component that is visible when the user interacts with the element.
 */
class Glow extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
    styles: PropTypes.shape({
      container: PropTypes.shape(),
      glow: PropTypes.shape(),
    }),
  };

  static defaultProps = {
    color: colors.shade8,
    className: null,
    styles: {
      container: null,
      glow: null,
    },
  };

  /**
   * The component constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.timeout = null;
    this.state = {
      hover: false,
    };
  }

  /**
   * Clears any previously set timeout.
   */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleTouchTap = () => {
    this.setState({ hover: true });

    this.timeout = setTimeout(() => {
      this.setState({ hover: false });
    }, 250);
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const innerInlineStyles = {
      ...this.props.styles.glow,
    };

    if (this.state.hover) {
      innerInlineStyles.background = this.props.color;
    }

    return (
      <div
        aria-hidden
        className={classNames(styles.container, this.props.className)}
        onTouchTap={this.handleTouchTap}
        style={this.props.styles.container}
      >
        <div className={styles.glow} style={innerInlineStyles} />
        {this.props.children}
      </div>
    );
  }
}

export default Glow;
