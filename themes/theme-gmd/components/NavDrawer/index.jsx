import React from 'react';
import { NavDrawer, ClientInformation } from '@shopgate/engage/components';
import Header from './components/Header';
import Main from './components/Main';
import QuickLinks from './components/QuickLinks';
import StoreInfo from './components/StoreInfo';
import LogoutButton from './components/LogoutButton';

/**
 * @returns {JSX}
 */
const NavDrawerContainer = () => (
  <NavDrawer>
    <Header />
    <Main />
    <QuickLinks />
    <StoreInfo />
    <LogoutButton />
    <ClientInformation />
  </NavDrawer>
);

export default NavDrawerContainer;
