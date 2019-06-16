import React from 'react';
import ClientInformation from '@shopgate/pwa-ui-shared/ClientInformation';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import Header from './components/Header';
import Main from './components/Main';
import QuickLinks from './components/QuickLinks';
import StoreInfo from './components/StoreInfo';
import LogoutButton from './components/LogoutButton';

/**
 * @returns {JSX}
 */
const NavDrawerContainer = () => (
  <NavDrawer aria-hidden>
    <Header />
    <Main />
    <QuickLinks />
    <StoreInfo />
    <LogoutButton />
    <ClientInformation />
  </NavDrawer>
);

export default NavDrawerContainer;
