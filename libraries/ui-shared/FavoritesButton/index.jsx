import React, { Component } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import HeartIcon from '../icons/HeartIcon';
import HeartOutlineIcon from '../icons/HeartOutlineIcon';
import Ripple from '../Ripple';
import styles from './style';
import connect from './connector';

/**
 * The favorites button component.
 */
class FavoritesButton extends Component {
  static propTypes = {
    active: PropTypes.bool,
    addFavorites: PropTypes.func,
    'aria-hidden': PropTypes.bool,
    className: PropTypes.string,
    noShadow: PropTypes.bool,
    // When true, button would react on click only once.
    once: PropTypes.bool,
    onRippleComplete: PropTypes.func,
    productId: PropTypes.string,
    removeFavorites: PropTypes.func,
    removeThrottle: PropTypes.number,
    removeWithRelatives: PropTypes.bool,
    rippleClassName: PropTypes.string,
  };

  /**
   * Context types definition.
   * @type {{i18n: shim}}
   */
  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    active: false,
    addFavorites: () => {},
    'aria-hidden': null,
    className: '',
    noShadow: false,
    once: false,
    onRippleComplete: () => {},
    productId: null,
    removeFavorites: () => {},
    removeThrottle: 0,
    removeWithRelatives: false,
    rippleClassName: '',
  };

  /**
   * Construct and init state
   * @param {Object} props Component props
   */
  constructor(props) {
    super(props);
    this.clickedOnce = false;
  }

  /**
   * Callback for the moment when the ripple animation is done.
   */
  onRippleComplete = () => {
    this.props.onRippleComplete(this.props.active);
  };

  /**
   * Returns text for aria-label.
   * @returns {string}
   */
  getLabel() {
    const { __ } = this.context.i18n();
    const lang = this.props.active ? 'favorites.remove' : 'favorites.add';
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

    if (!this.props.active) {
      this.props.addFavorites(this.props.productId);
    } else {
      setTimeout(() => {
        this.props.removeFavorites(this.props.productId, this.props.removeWithRelatives);
      }, this.props.removeThrottle);
    }
  };

  /**
   * Renders the heart icon as filled or outlined, depending on the favorite button being active.
   * @returns {JSX}
   */
  renderIcon() {
    if (this.props.active) {
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
        aria-hidden={this.props['aria-hidden']}
        className={`${className} ${this.props.className}`}
        onClick={this.handleClick}
        data-test-id="favoriteButton"
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
