import React, { Fragment } from 'react';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { useSideNavigation } from './SideNavigation.hooks';
import SideNavigationItem from './SideNavigationItem';
import SideNavigationLinksQuicklinks from './SideNavigationLinksQuicklinks';
import SideNavigationLinksLegal from './SideNavigationLinksLegal';
import { ACCOUNT_PATH } from '../../account';
/**
 * SideNavigationLinks component
 * @returns {JSX}
 */
const SideNavigationLinks = () => {
  const { isLoggedIn, logout } = useSideNavigation();

  return (
    <Fragment>
      <SideNavigationItem href={CART_PATH} label="navigation.cart" />
      {appConfig.hasFavorites ? (
        <SideNavigationItem href={FAVORITES_PATH} label="navigation.favorites" />
      ) : null}
      {isLoggedIn && <SideNavigationItem href={ACCOUNT_PATH} label="navigation.your_account" />}
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
