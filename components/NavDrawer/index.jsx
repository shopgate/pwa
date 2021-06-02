import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
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
const NavDrawerContainer = ({ onOpen, onClose }) => (
  <NavDrawer onOpen={onOpen} onClose={onClose}>
    <Header />
    <Main />
    <QuickLinks />
    <StoreInfo />
    <LogoutButton />
    <ClientInformation />
  </NavDrawer>
);

NavDrawerContainer.propTypes = {
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

NavDrawerContainer.defaultProps = {
  onClose: noop,
  onOpen: noop,
};

export default NavDrawerContainer;
