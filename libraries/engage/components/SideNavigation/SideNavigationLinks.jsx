import React, { Fragment } from 'react';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { useSideNavigation } from './SideNavigation.hooks';
import SideNavigationItem from './SideNavigationItem';
import SideNavigationLinksLegal from './SideNavigationLinksLegal';
/**
 * SideNavigationLinks component
 * @returns {JSX}
 */
const SideNavigationLinks = () => {
  const { isLoggedIn, logout } = useSideNavigation();

  return (
    <Fragment>
      <SideNavigationItem href={CART_PATH} label="navigation.cart" />
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
