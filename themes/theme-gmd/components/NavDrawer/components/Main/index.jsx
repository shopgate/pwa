import React from 'react';
import PropTypes from 'prop-types';
import { NavDrawer } from '@shopgate/engage/components';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import HomeButton from './components/HomeButton';
import CategoryButton from './components/CategoryButton';
import FavoritesButton from './components/FavoritesButton';
import CartButton from './components/CartButton';
import ScannerButton from './components/ScannerButton';
import AccountButton from './components/AccountButton';
import BackInStockButton from './components/BackInStockButton';
import connect from './connector';

/**
 * @return {JSX}
 */
const MainSection = ({ isLoggedIn }) => (
  <NavDrawer.Section dividerTop={false}>
    <HomeButton />
    <CategoryButton />
    {appConfig.hasFavorites && <FavoritesButton />}
    <CartButton />
    {hasNewServices() && isLoggedIn && <AccountButton />}
    <ScannerButton />
    <BackInStockButton />
  </NavDrawer.Section>
);

MainSection.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default connect(MainSection);
