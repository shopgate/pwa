/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import HeartIcon from 'Components/icons/HeartIcon';
import HeartOutlineIcon from 'Components/icons/HeartOutlineIcon';
import Ripple from 'Components/Ripple';
import styles from './style';
import connect from './connector';

/**
 * The favorites button component.
 */
class FavoritesButton extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    addFavorites: PropTypes.func,
    className: PropTypes.string,
    onRippleComplete: PropTypes.func,
    productId: PropTypes.string,
    readOnlyOnFetch: PropTypes.bool,
    removeFavorites: PropTypes.func,
    removeThrottle: PropTypes.number,
    rippleClassName: PropTypes.string,
  };

  static defaultProps = {
    addFavorites: () => {},
    className: '',
    onRippleComplete: () => {},
    productId: null,
    readOnlyOnFetch: false,
    removeFavorites: () => {},
    removeThrottle: 0,
    rippleClassName: '',
  };

  /**
   * Construct and init state
   * @param {Object} props Component props
   */
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
      isFetching: props.isFetching,
    };
  }

  /**
   * Update active state with next active prop
   * @param {Object} nextProps Next props
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.active,
      isFetching: nextProps.isFetching,
    });
  }

  /**
   * Callback for the moment when the ripple animation is done.
   */
  onRippleComplete = () => {
    this.props.onRippleComplete(this.state.active);
  };

  /**
   * Checks if button is currently read-only.
   * @return {boolean} read only "state" of the component
   */
  isReadOnly() {
    return this.state.isFetching && this.props.readOnlyOnFetch;
  }

  /**
   * Adds or removes a given product ID from the favorite list.
   * @param {Object} event The click event object.
   */
  handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.isReadOnly()) {
      return;
    }

    if (!this.props.productId) {
      return;
    }

    if (!this.state.active) {
      this.props.addFavorites(this.props.productId);
    } else {
      setTimeout(() => {
        this.props.removeFavorites(this.props.productId);
      }, this.props.removeThrottle);
    }

    this.setState({
      active: !this.state.active,
      isFetching: true,
    });
  };

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
   * @returns {JSX|null}
   */
  render() {
    if (!appConfig.hasFavorites) {
      return null;
    }
    return (
      <button
        className={`${styles.button} ${this.props.className}`}
        onClick={this.handleClick}
      >
        <Ripple
          className={`${styles.ripple} ${this.props.rippleClassName}`}
          onComplete={this.onRippleComplete}
          disabled={this.isReadOnly()}
        >
          {this.renderIcon()}
        </Ripple>
      </button>
    );
  }
}

export default connect(FavoritesButton);
