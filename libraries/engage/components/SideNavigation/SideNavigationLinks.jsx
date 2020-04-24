import React, { Fragment } from 'react';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import SideNavigationItem from './SideNavigationItem';

const IMPRINT_PATH = `${PAGE_PATH}/imprint`;
const PRIVACY_PATH = `${PAGE_PATH}/privacy`;
const TERMS_PATH = `${PAGE_PATH}/terms`;

/**
 * SideNavigationLinks component
 * @returns {JSX}
 */
const SideNavigationLinks = () => (
  <Fragment>
    <SideNavigationItem href={CART_PATH} label="navigation.cart" />
    <SideNavigationItem href={TERMS_PATH} label="navigation.terms" />
    <SideNavigationItem href={IMPRINT_PATH} label="navigation.about" />
    <SideNavigationItem href={PRIVACY_PATH} label="navigation.privacy" />
  </Fragment>
);

export default SideNavigationLinks;
