import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  NAV_MENU_FAVORITES,
  NAV_MENU_FAVORITES_AFTER,
  NAV_MENU_FAVORITES_BEFORE,
} from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import Portal from '@shopgate/pwa-common/components/Portal';
import HeartIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import { i18n } from '@shopgate/engage/core';
import Badge from './components/Badge';
import connect from '../../../../connector';
import connectBadge from './components/Badge/connector';
import portalProps from '../../../../portalProps';

const LABEL = 'navigation.favorites';

/**
 * @param {Object} props The component props
 * @param {Function} props.navigate The navigate action.
 * @param {Function} props.count The favorite list item count.
 * @param {Function} props.showWishlistItemsCountBadge Whether to show the badge or not
 * @returns {JSX}
 */
const FavoritesButton = ({ navigate, count, showWishlistItemsCountBadge }) => {
  const ariaLabel = showWishlistItemsCountBadge ? `${i18n.text(LABEL)}. ${i18n.text('common.products')}: ${count}.` : '';

  return (
    <>
      <Portal name={NAV_MENU_FAVORITES_BEFORE} props={portalProps} />
      <Portal name={NAV_MENU_FAVORITES} props={portalProps}>
        <NavDrawer.Item
          {...(showWishlistItemsCountBadge ? { badge: Badge } : {})}
          label={LABEL}
          aria-label={ariaLabel}
          icon={HeartIcon}
          onClick={navigate(FAVORITES_PATH, LABEL)}
          testId="navDrawerFavoritesButton"
        />
      </Portal>
      <Portal name={NAV_MENU_FAVORITES_AFTER} props={portalProps} />
    </>
  );
};

FavoritesButton.propTypes = {
  navigate: PropTypes.func.isRequired,
  showWishlistItemsCountBadge: PropTypes.bool.isRequired,
  count: PropTypes.number,
};

FavoritesButton.defaultProps = {
  count: 0,
};

export default connect(connectBadge(FavoritesButton));
