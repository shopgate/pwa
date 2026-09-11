import SurroundPortals from '@shopgate/pwa-common/components/SurroundPortals';
import HeartIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import { useSelector } from 'react-redux';
import { NAV_MENU_FAVORITES } from '@shopgate/pwa-common-commerce/favorites/constants/Portals';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { getFavoritesCount } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/settings/selectors/shopSettings';
import { i18n } from '@shopgate/engage/core/helpers';
import { useNavDrawerNavigate } from '../../hooks';
import portalProps from '../../portalProps';
import FavoritesBadge from '../badges/FavoritesBadge';

const LABEL = 'navigation.favorites';

/**
 * Renders the favorites entry of the navigation drawer.
 * @returns The rendered entry.
 */
const FavoritesButton = () => {
  const navigate = useNavDrawerNavigate();
  const showBadge = useSelector(getShowWishlistItemsCountBadge);
  const count = useSelector(state => getFavoritesCount(state, { useItemQuantity: true }));
  const ariaLabel = showBadge
    ? `${i18n.text(LABEL)}. ${i18n.text('common.products')}: ${count}.`
    : '';

  return (
    <SurroundPortals portalName={NAV_MENU_FAVORITES} portalProps={portalProps}>
      <NavDrawer.Item
        {...(showBadge ? { badge: FavoritesBadge } : {})}
        label={LABEL}
        aria-label={ariaLabel}
        icon={HeartIcon}
        onClick={navigate(FAVORITES_PATH, LABEL)}
        testId="navDrawerFavoritesButton"
      />
    </SurroundPortals>
  );
};

export default FavoritesButton;
