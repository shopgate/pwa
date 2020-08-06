import React from 'react';
import PropTypes from 'prop-types';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import appConfig from '@shopgate/pwa-common/helpers/config';
import HomeButton from './components/HomeButton';
import CategoryButton from './components/CategoryButton';
import FavoritesButton from './components/FavoritesButton';
import ScannerButton from './components/ScannerButton';
import AccountButton from './components/AccountButton';
import connect from './connector';

/**
 * @return {JSX}
 */
const MainSection = ({ isLoggedIn }) => (
  <NavDrawer.Section dividerTop={false}>
    <HomeButton />
    <CategoryButton />
    {appConfig.hasFavorites && <FavoritesButton />}
    {isLoggedIn && <AccountButton />}
    <ScannerButton />
  </NavDrawer.Section>
);

MainSection.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default connect(MainSection);
