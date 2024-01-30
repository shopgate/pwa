import React from 'react';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import appConfig from '@shopgate/pwa-common/helpers/config';
import PropTypes from 'prop-types';
import HomeButton from './components/HomeButton';
import CategoryButton from './components/CategoryButton';
import FavoritesButton from './components/FavoritesButton';
import CartButton from './components/CartButton';
import ScannerButton from './components/ScannerButton';
import BackInStockButton from './components/BackInStockButton';
import connect from './connector';

/**
 * @param {boolean} isBackinStockEnabled Whether the back in stock feature is enabled
 * @return {JSX}
 */
const MainSection = ({ isBackInStockEnabled }) => (
  <NavDrawer.Section dividerTop={false}>
    <HomeButton />
    <CategoryButton />
    {appConfig.hasFavorites && <FavoritesButton />}
    <CartButton />
    <ScannerButton />
    {isBackInStockEnabled && <BackInStockButton />}
  </NavDrawer.Section>
);

MainSection.propTypes = {
  isBackInStockEnabled: PropTypes.bool.isRequired,
};

export default connect(MainSection);
