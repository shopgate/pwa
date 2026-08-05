import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import { makeStyles } from '@shopgate/engage/styles';
import { hasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import FavoritesIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import * as portals from '../../constants';
import FavoritesIconBadge from './components/FavoritesIconBadge'; // eslint-disable-line import/no-named-as-default
import TabBarAction from '../TabBarAction';
import connect from '../connector';
import connectBadge from './components/FavoritesIconBadge/connector';
import { useShowFavoritesCounter } from './hooks';

const useIconStyles = makeStyles()({
  icon: {
    height: 24,
    width: 24,
  },
});

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
    ...tabBarActionProps
  } = props;
  const showConfiguredCounter = useShowFavoritesCounter();

  const handleClick = useCallback(() => {
    historyPush({ pathname: FAVORITES_PATH });
  }, [historyPush]);

  const showCounter = (hasNewServices() && showWishlistItemsCountBadge)
    || (!hasNewServices() && showConfiguredCounter);

  const ariaLabel = useMemo(() => {
    const ariaCount = showCounter ? `${i18n.text('common.products')}: ${favoritesCount}.` : '';
    return `${i18n.text(label)}. ${ariaCount} `;
  }, [favoritesCount, label, showCounter]);

  // `widgetSettings` used to reach the portals via the withWidgetSettings HOC. It is kept in the
  // payload for extensions, but now carries the resolved value instead of the raw legacy settings.
  const portalProps = {
    ...props,
    widgetSettings: { showCounter: showConfiguredCounter },
    TabBarAction,
  };

  return (
    <>
      <Portal
        name={portals.TAB_BAR_FAVORITES_BEFORE}
        props={portalProps}
      />
      <Portal
        name={portals.TAB_BAR_FAVORITES}
        props={portalProps}
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
        props={portalProps}
      />
    </>
  );
};

TabBarFavoritesAction.propTypes = {
  favoritesCount: PropTypes.number.isRequired,
  historyPush: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  showWishlistItemsCountBadge: PropTypes.bool.isRequired,
  ...TabBarAction.propTypes,
};

TabBarFavoritesAction.defaultProps = {
  ...TabBarAction.defaultProps,
};

export default connect(connectBadge(memo(TabBarFavoritesAction)));
