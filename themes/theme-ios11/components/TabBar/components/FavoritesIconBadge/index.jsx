import React, { memo } from 'react';
import PropTypes from 'prop-types';
import TabBarBadge from '../TabBarBadge';

const MAX_NUMBER = 999;

/**
 * Favorites icon badge.
 * @param {Object} props Props.
 * @param {number} props.favoritesCount The number of favorites.
 * @param {boolean} props.showWishlistItemsCountBadge Whether the shop shows the badge.
 * @param {boolean} props.showCounter Whether the badge shows the number.
 * @returns {JSX.Element|null}
 */
const FavoritesIconBadge = ({
  favoritesCount,
  showWishlistItemsCountBadge,
  showCounter,
}) => {
  if (!showWishlistItemsCountBadge) {
    return null;
  }

  return (
    <TabBarBadge
      count={favoritesCount}
      max={MAX_NUMBER}
      showCount={showCounter}
      className="theme__tab-bar__favorites-icon-badge"
    />
  );
};

FavoritesIconBadge.propTypes = {
  favoritesCount: PropTypes.number.isRequired,
  showCounter: PropTypes.bool.isRequired,
  showWishlistItemsCountBadge: PropTypes.bool.isRequired,
};

export default memo(FavoritesIconBadge);
