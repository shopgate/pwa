/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeartIcon from 'Components/icons/HeartIcon';
import HeartOutlineIcon from 'Components/icons/HeartOutlineIcon';
import Ripple from 'Components/Ripple';
import styles from './style';

/**
 * The favorites button component.
 */
class FavoritesButton extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };
  }

  /**
   * Adds or removes a given product ID from the favorite list.
   * @param {Object} event The click event object.
   */
  handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      active: !this.state.active,
    });
  }

  /**
   * Renders the heart icon as filled or outlined, depending on the favorite list state.
   * @returns {JSX}
   */
  renderIcon() {
    if (this.state.active) {
      return <HeartIcon />;
    }

    return <HeartOutlineIcon />;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <button className={`${styles.button} ${this.props.className}`} onClick={this.handleClick}>
        <Ripple className={styles.ripple}>
          {this.renderIcon()}
        </Ripple>
      </button>
    );
  }
}

export default FavoritesButton;
