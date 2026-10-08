import { useSelector } from 'react-redux';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import HomeButton from './buttons/HomeButton';
import CategoryButton from './buttons/CategoryButton';
import FavoritesButton from './buttons/FavoritesButton';
import CartButton from './buttons/CartButton';
import ScannerButton from './buttons/ScannerButton';
import AccountButton from './buttons/AccountButton';
import BackInStockButton from './buttons/BackInStockButton';

const { hasFavorites } = appConfig as { hasFavorites?: boolean };

/**
 * Renders the main navigation section of the navigation drawer.
 * @returns The rendered section.
 */
const Main = () => {
  const isLoggedIn = useSelector(isUserLoggedIn);

  return (
    <NavDrawer.Section dividerTop={false}>
      <HomeButton />
      <CategoryButton />
      {hasFavorites && <FavoritesButton />}
      <CartButton />
      {hasNewServices() && isLoggedIn && <AccountButton />}
      <ScannerButton />
      <BackInStockButton />
    </NavDrawer.Section>
  );
};

export default Main;
