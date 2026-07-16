import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CounterBadge } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';
import connect from './connector';

const MAX_NUMBER = 999;

const defaultWidgetSettings = { showCounter: true };

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
  widgetSettings = defaultWidgetSettings,
}) => {
  const { classes, cx } = useStyles();

  if (!showWishlistItemsCountBadge) {
    return null;
  }

  const showCounter = widgetSettings.showCounter ?? defaultWidgetSettings.showCounter;

  return (
    <CounterBadge
      count={favoritesCount}
      max={MAX_NUMBER}
      showCount={showCounter !== false}
      className={cx(classes.root, 'theme__tab-bar__favorites-icon-badge')}
    />
  );
};

export { FavoritesIconBadge };

FavoritesIconBadge.propTypes = {
  favoritesCount: PropTypes.number,
  showWishlistItemsCountBadge: PropTypes.bool,
  widgetSettings: PropTypes.shape({
    showCounter: PropTypes.bool,
  }),
};

FavoritesIconBadge.defaultProps = {
  favoritesCount: 0,
  showWishlistItemsCountBadge: true,
  widgetSettings: defaultWidgetSettings,
};

export default withWidgetSettings(
  connect(memo(FavoritesIconBadge)),
  '@shopgate/theme-ios11/components/TabBar/FavoritesIconBadge'
);
