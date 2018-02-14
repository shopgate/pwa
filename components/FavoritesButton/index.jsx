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
    active: PropTypes.bool,
    addFavorites: PropTypes.func,
    className: PropTypes.string,
    noShadow: PropTypes.bool,
    // When true, button would react on click only once.
    once: PropTypes.bool,
    onRippleComplete: PropTypes.func,
    productId: PropTypes.string,
    removeFavorites: PropTypes.func,
    removeThrottle: PropTypes.number,
    rippleClassName: PropTypes.string,
  };

  static defaultProps = {
    active: false,
    addFavorites: () => {},
    className: '',
    noShadow: false,
    once: false,
    onRippleComplete: () => {},
    productId: null,
    removeFavorites: () => {},
    removeThrottle: 0,
    rippleClassName: '',
  };

  /**
   * Context types definition.
   * @type {{i18n: shim}}
   */
  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Construct and init state
   * @param {Object} props Component props
   */
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
    };
    this.clickedOnce = false;
  }

  /**
   * Update active state with next active prop
   * @param {Object} nextProps Next props
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      active: nextProps.active,
    });
  }

  /**
   * Callback for the moment when the ripple animation is done.
   */
  onRippleComplete = () => {
    this.props.onRippleComplete(this.state.active);
  };

  /**
   * Returns text for aria-label.
   * @returns {string}
   */
  getLabel() {
    const { __ } = this.context.i18n();
    const lang = this.state.active ? 'favorites.remove' : 'favorites.add';
    return __(lang);
  }

  /**
   * Adds or removes a given product ID from the favorite list.
   * @param {Object} event The click event object.
   */
  handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.once && this.clickedOnce) {
      return;
    }

    this.clickedOnce = true;

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
    const className = this.props.noShadow ? styles.buttonFlat : styles.button;
    return (
      <button
        aria-label={this.getLabel()}
        className={`${className} ${this.props.className}`}
        onClick={this.handleClick}
      >
        <Ripple
          className={`${styles.ripple} ${this.props.rippleClassName}`}
          onComplete={this.onRippleComplete}
        >
          {this.renderIcon()}
        </Ripple>
      </button>
    );
  }
}

export default connect(FavoritesButton);
