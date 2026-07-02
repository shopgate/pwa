import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';
import connect from './connector';

const MAX_NUMBER = 999;

const defaultWidgetSettings = { showCounter: true };

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'absolute',
    background: theme.components.tabBar.badgeBackground,
    color: theme.components.tabBar.badgeColor,
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.components.tabBar.badgeBorderRadius,
    height: theme.spacing(2),
    top: theme.components.tabBar.badgeTop,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    minWidth: theme.spacing(2),
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

  if (!showWishlistItemsCountBadge || favoritesCount === 0) {
    return null;
  }

  const showCounter = widgetSettings.showCounter ?? defaultWidgetSettings.showCounter;

  const number = (favoritesCount > MAX_NUMBER)
    ? `${MAX_NUMBER}+`
    : favoritesCount;

  return (
    <Typography variant="caption" component="div" fontWeight="bold" className={cx(classes.root, 'theme__tab-bar__favorites-icon-badge theme__badge')}>
      {showCounter !== false ? number : ''}
    </Typography>
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
