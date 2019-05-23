import React from 'react';
import { NavDrawer } from '@shopgate/engage/components';
import appConfig from '@shopgate/pwa-common/helpers/config';
import HomeButton from './components/HomeButton';
import CategoryButton from './components/CategoryButton';
import FavoritesButton from './components/FavoritesButton';
import CartButton from './components/CartButton';
import ScannerButton from './components/ScannerButton';

/**
 * @return {JSX}
 */
const MainSection = () => (
  <NavDrawer.Section dividerTop={false}>
    <HomeButton />
    <CategoryButton />
    {appConfig.hasFavorites && <FavoritesButton />}
    <CartButton />
    <ScannerButton />
  </NavDrawer.Section>
);

export default MainSection;
