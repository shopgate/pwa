import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withWidgetSettings } from '@shopgate/engage/core';
import connect from './connector';
import style from './style';

/**
 * Favorites icon badge.
 */
export class FavoritesIconBadge extends Component {
  static MAX_NUMBER = 999;

  static propTypes = {
    favoritesCount: PropTypes.number,
    widgetSettings: PropTypes.shape({
      showCounter: PropTypes.bool,
    }),
  };

  static defaultProps = {
    favoritesCount: 0,
    widgetSettings: {
      showCounter: true,
    },
  };

  /**
   * Disallows component to update when favorites count is the same or above the maximum limit.
   * @param {Object} nextProps Next props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (nextProps.favoritesCount === this.props.favoritesCount) {
      return false;
    }
    // No re-render if it's 999+
    if (
      nextProps.favoritesCount > this.constructor.MAX_NUMBER
      && this.props.favoritesCount > this.constructor.MAX_NUMBER
    ) {
      return false;
    }
    return true;
  }

  /**
   * Renders component.
   * @returns {JSX}
   */
  render() {
    const { showCounter } = this.props.widgetSettings;

    if (this.props.favoritesCount === 0) {
      return null;
    }

    const number = (this.props.favoritesCount > this.constructor.MAX_NUMBER) ?
      `${this.constructor.MAX_NUMBER}+`
      : this.props.favoritesCount;
    return (
      <div className={`${style} theme__tab-bar__favorites-icon-badge theme__badge`}>
        {showCounter !== false ? number : ''}
      </div>
    );
  }
}

export default withWidgetSettings(connect(FavoritesIconBadge), '@shopgate/theme-ios11/components/TabBar/FavoritesIconBadge');
