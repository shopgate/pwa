import React from 'react';
import appConfig from '@shopgate/pwa-common/helpers/config';
import showReturnPolicy from '@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy';
import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import Header from './components/Header';
import HomeButton from './components/HomeButton';
import CategoryButton from './components/CategoryButton';
import FavoritesButton from './components/FavoritesButton';
import CartButton from './components/CartButton';
import QuickLinks from './components/QuickLinks';
import ShippingButton from './components/ShippingButton';
import PaymentButton from './components/PaymentButton';
import TermsButton from './components/TermsButton';
import PrivacyButton from './components/PrivacyButton';
import ReturnsButton from './components/ReturnsButton';
import ImprintButton from './components/ImprintButton';
import LogoutButton from './components/LogoutButton';

// TODO: Add submenu header support
// const { showGmdMenuSubHeaders = false } = appConfig;

/**
 * @returns {JSX}
 */
const NavDrawerContainer = () => (
  <NavDrawer>
    <Header />
    <HomeButton />
    <CategoryButton />
    {appConfig.hasFavorites && <FavoritesButton />}
    <CartButton />
    <QuickLinks />
    <NavDrawer.Divider />
    <ShippingButton />
    <PaymentButton />
    <TermsButton />
    <PrivacyButton />
    {showReturnPolicy && <ReturnsButton />}
    <ImprintButton />
    <LogoutButton />
    <ClientInformation />
  </NavDrawer>
);

export default NavDrawerContainer;
