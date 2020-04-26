import React, { Fragment } from 'react';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { PAGE_PATH, LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { useSideNavigation } from './SideNavigation.hooks';
import SideNavigationItem from './SideNavigationItem';

const IMPRINT_PATH = `${PAGE_PATH}/imprint`;
const PRIVACY_PATH = `${PAGE_PATH}/privacy`;
const TERMS_PATH = `${PAGE_PATH}/terms`;

/**
 * SideNavigationLinks component
 * @returns {JSX}
 */
const SideNavigationLinks = () => {
  const { isLoggedIn, logout } = useSideNavigation();

  return (
    <Fragment>
      <SideNavigationItem href={CART_PATH} label="navigation.cart" />
      <SideNavigationItem href={TERMS_PATH} label="navigation.terms" />
      <SideNavigationItem href={IMPRINT_PATH} label="navigation.about" />
      <SideNavigationItem href={PRIVACY_PATH} label="navigation.privacy" />
      {isLoggedIn ? (
        <SideNavigationItem onClick={logout} label="navigation.logout" />
      ) : (
        <SideNavigationItem href={LOGIN_PATH} label="navigation.login_register" />
      )}
    </Fragment>
  );
};

export default SideNavigationLinks;
