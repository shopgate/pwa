import React from 'react';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import appConfig from '@shopgate/pwa-common/helpers/config';
import HomeButton from './components/HomeButton';
import CategoryButton from './components/CategoryButton';
import FavoritesButton from './components/FavoritesButton';
import CartButton from './components/CartButton';

/**
 * @return {JSX}
 */
const MainSection = () => (
  <NavDrawer.Section>
    <HomeButton />
    <CategoryButton />
    {appConfig.hasFavorites && <FavoritesButton />}
    <CartButton />
  </NavDrawer.Section>
);

export default MainSection;
