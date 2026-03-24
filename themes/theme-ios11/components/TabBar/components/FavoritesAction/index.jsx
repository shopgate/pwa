import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { makeStyles } from '@shopgate/engage/styles';
import { withWidgetSettings } from '@shopgate/engage/core/hocs';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import FavoritesIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import { i18n } from '@shopgate/engage/core';
import * as portals from '../../constants';
import FavoritesIconBadge from './components/FavoritesIconBadge'; // eslint-disable-line import/no-named-as-default
import TabBarAction from '../TabBarAction';
import connect from '../connector';
import connectBadge from './components/FavoritesIconBadge/connector';

const useIconStyles = makeStyles()({
  icon: {
    height: 24,
    width: 24,
  },
});

const defaultWidgetSettings = { showCounter: true };

/**
 * The tab bar favorites action.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TabBarFavoritesAction = (props) => {
  const { classes } = useIconStyles();
  const {
    favoritesCount,
    historyPush,
    label,
    showWishlistItemsCountBadge,
    widgetSettings = defaultWidgetSettings,
    ...tabBarActionProps
  } = props;

  const handleClick = useCallback(() => {
    historyPush({ pathname: FAVORITES_PATH });
  }, [historyPush]);

  const showCounter = (hasNewServices() && showWishlistItemsCountBadge)
    || (!hasNewServices() && (widgetSettings.showCounter ?? defaultWidgetSettings.showCounter));

  const ariaLabel = useMemo(() => {
    const ariaCount = showCounter ? `${i18n.text('common.products')}: ${favoritesCount}.` : '';
    return `${i18n.text(label)}. ${ariaCount} `;
  }, [favoritesCount, label, showCounter]);

  return (
    <>
      <Portal
        name={portals.TAB_BAR_FAVORITES_BEFORE}
        props={{
          ...props,
          TabBarAction,
        }}
      />
      <Portal
        name={portals.TAB_BAR_FAVORITES}
        props={{
          ...props,
          TabBarAction,
        }}
      >
        <TabBarAction
          {...tabBarActionProps}
          label={label}
          aria-label={ariaLabel}
          icon={(
            <Portal name={portals.TAB_BAR_FAVORITES_ICON}>
              <FavoritesIcon className={classes.icon} />
            </Portal>
          )}
          onClick={handleClick}
        >
          <FavoritesIconBadge />
        </TabBarAction>
      </Portal>
      <Portal
        name={portals.TAB_BAR_FAVORITES_AFTER}
        props={{
          ...props,
          TabBarAction,
        }}
      />
    </>
  );
};

TabBarFavoritesAction.propTypes = {
  favoritesCount: PropTypes.number.isRequired,
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  showWishlistItemsCountBadge: PropTypes.bool.isRequired,
  widgetSettings: PropTypes.shape({
    showCounter: PropTypes.bool,
  }),
  ...TabBarAction.propTypes,
};

TabBarFavoritesAction.defaultProps = {
  widgetSettings: defaultWidgetSettings,
  ...TabBarAction.defaultProps,
};

export default withWidgetSettings(
  connect(connectBadge(memo(TabBarFavoritesAction))),
  '@shopgate/theme-ios11/components/TabBar/FavoritesIconBadge'
);
