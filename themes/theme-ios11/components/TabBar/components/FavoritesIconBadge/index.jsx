import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const MAX_NUMBER = 999;

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    borderRadius: theme.components.tabBar.badgeBorderRadius,
    top: theme.components.tabBar.badgeTop,
    transform: 'translateX(-50%)',
    left: theme.components.tabBar.badgeLeft,
  },
}));

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
  const { classes, cx } = useStyles();

  if (!showWishlistItemsCountBadge) {
    return null;
  }

  return (
    <Badge
      count={favoritesCount}
      max={MAX_NUMBER}
      showCount={showCounter}
      className={cx(classes.root, 'theme__tab-bar__favorites-icon-badge')}
    />
  );
};

FavoritesIconBadge.propTypes = {
  favoritesCount: PropTypes.number.isRequired,
  showCounter: PropTypes.bool.isRequired,
  showWishlistItemsCountBadge: PropTypes.bool.isRequired,
};

export default memo(FavoritesIconBadge);
