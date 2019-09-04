import React, { Component } from 'react';
import Proptypes from 'prop-types';
import connect from './connector';
import style from './style';

/**
 * Favorites icon badge.
 */
export class FavoritesIconBadge extends Component {
  static MAX_NUMBER = 999;

  static propTypes = {
    favoritesCount: Proptypes.number,
  };

  static defaultProps = {
    favoritesCount: 0,
  };

  /**
   * Disallows component to udpate when favorites count is the same or above the maximum limit.
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
    if (this.props.favoritesCount === 0) {
      return null;
    }
    const number = (this.props.favoritesCount > this.constructor.MAX_NUMBER) ?
      `${this.constructor.MAX_NUMBER}+`
      : this.props.favoritesCount;
    return (
      <div className={style}>{number}</div>
    );
  }
}

export default connect(FavoritesIconBadge);
