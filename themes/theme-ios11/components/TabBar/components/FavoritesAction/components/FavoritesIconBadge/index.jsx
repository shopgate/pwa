import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';
import connect from './connector';

const { variables } = themeConfig;

const MAX_NUMBER = 999;

const defaultWidgetSettings = { showCounter: true };

const useStyles = makeStyles()({
  root: {
    position: 'absolute',
    background: 'var(--tab-bar-item-badge-background)',
    color: 'var(--tab-bar-item-badge-color)',
    fontSize: '0.7rem',
    lineHeight: 1.5,
    fontWeight: 'bold',
    borderRadius: 'var(--tab-bar-item-badge-border-radius)',
    height: variables.gap.big,
    top: 'var(--tab-bar-item-badge-top)',
    paddingLeft: variables.gap.small / 2,
    paddingRight: variables.gap.small / 2,
    minWidth: variables.gap.big,
    transform: 'translateX(-50%)',
    left: 'var(--tab-bar-item-badge-left)',
  },
});

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
  const { classes } = useStyles();

  if (!showWishlistItemsCountBadge || favoritesCount === 0) {
    return null;
  }

  const showCounter = widgetSettings.showCounter ?? defaultWidgetSettings.showCounter;

  const number = (favoritesCount > MAX_NUMBER)
    ? `${MAX_NUMBER}+`
    : favoritesCount;

  return (
    <div className={`${classes.root} theme__tab-bar__favorites-icon-badge theme__badge`}>
      {showCounter !== false ? number : ''}
    </div>
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
