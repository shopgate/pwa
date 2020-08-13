import React, { Fragment } from 'react';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useSideNavigation } from './SideNavigation.hooks';
import SideNavigationItem from './SideNavigationItem';
import SideNavigationNestedItem from './SideNavigationNestedItem';
import SideNavigationLinksQuicklinks from './SideNavigationLinksQuicklinks';
import SideNavigationLinksLegal from './SideNavigationLinksLegal';
import {
  PROFILE_PATH,
  WISH_LIST_PATH,
  ORDERS_PATH,
} from '../../account';
/**
 * SideNavigationLinks component
 * @returns {JSX}
 */
const SideNavigationLinks = () => {
  const { isLoggedIn, logout, currentPathname } = useSideNavigation();

  const isAccountActive = currentPathname === PROFILE_PATH ||
    currentPathname === ORDERS_PATH ||
    currentPathname === WISH_LIST_PATH;

  return (
    <Fragment>
      <SideNavigationItem href={CART_PATH} label="navigation.cart" />
      {!isLoggedIn && appConfig.hasFavorites ? (
        <SideNavigationItem href={FAVORITES_PATH} label="navigation.favorites" />
      ) : null}
      {isLoggedIn && (
      <SideNavigationNestedItem
        href={PROFILE_PATH}
        label="navigation.your_account"
        forceActive={isAccountActive}
        level={0}
      >
        <ul>
          <SideNavigationItem level={1} href={PROFILE_PATH} label="titles.profile" />
          <SideNavigationItem level={1} href={ORDERS_PATH} label="titles.order_history" />
          {appConfig.hasFavorites ? (
            <SideNavigationItem level={1} href={WISH_LIST_PATH} label="titles.favorites" />
          ) : null}
        </ul>
      </SideNavigationNestedItem>
      )}
      <SideNavigationLinksQuicklinks />
      <SideNavigationLinksLegal />
      {isLoggedIn ? (
        <SideNavigationItem onClick={logout} label="navigation.logout" />
      ) : (
        <SideNavigationItem href={LOGIN_PATH} label="navigation.login_register" />
      )}
    </Fragment>
  );
};

export default SideNavigationLinks;
