import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { useShowFavoritesCounter } from '../../hooks';
import connect from './connector';

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
 * @returns {JSX.Element|null}
 */
const FavoritesIconBadge = ({
  favoritesCount = 0,
  showWishlistItemsCountBadge = true,
}) => {
  const { classes, cx } = useStyles();
  const showCounter = useShowFavoritesCounter();

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

export { FavoritesIconBadge };

FavoritesIconBadge.propTypes = {
  favoritesCount: PropTypes.number,
  showWishlistItemsCountBadge: PropTypes.bool,
};

FavoritesIconBadge.defaultProps = {
  favoritesCount: 0,
  showWishlistItemsCountBadge: true,
};

export default connect(memo(FavoritesIconBadge));
