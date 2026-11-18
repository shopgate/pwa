import { useSelector } from 'react-redux';
import { hasNewServices, i18n } from '@shopgate/engage/core/helpers';
import { getShowWishlistItemsCountBadge } from '@shopgate/engage/settings/selectors/shopSettings';
import { getCartProductCount } from '@shopgate/pwa-common-commerce/cart/selectors';
import { getFavoritesCount } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { getCountAriaLabel } from '../../../../helpers/countAriaLabel';
import CartItemBadge from '../CartItemBadge';
import FavoritesIconBadge from '../FavoritesIconBadge';
import { useShowFavoritesCounter } from '../FavoritesIconBadge/hooks';
import type { TabExtras } from './tabTypes';

const FAVORITES_COUNT_PROPS = { useItemQuantity: true };

/**
 * Selects the number of favorites, counting the quantity of each item.
 * @param state The application state.
 * @returns The number of favorites.
 */
const selectFavoritesCount = (state: unknown): number => (
  getFavoritesCount(state, FAVORITES_COUNT_PROPS)
);

/**
 * Provides the cart count for the portals, the aria label and the badge of the cart tab.
 * @param label The i18n key of the tab label.
 * @returns The additions of the cart tab.
 */
export const useCartTabExtras = (label: string): TabExtras => {
  const cartProductCount: number = useSelector(getCartProductCount);

  return {
    portalProps: { cartProductCount },
    ariaLabel: getCountAriaLabel(i18n.text(label), cartProductCount),
    badge: <CartItemBadge cartProductCount={cartProductCount} />,
  };
};

/**
 * Provides the favorites count and counter settings for the portals, the aria label and the
 * badge of the favorites tab.
 * @param label The i18n key of the tab label.
 * @returns The additions of the favorites tab.
 */
export const useFavoritesTabExtras = (label: string): TabExtras => {
  const favoritesCount = useSelector(selectFavoritesCount);
  const showWishlistItemsCountBadge: boolean = useSelector(getShowWishlistItemsCountBadge);
  const showConfiguredCounter = useShowFavoritesCounter();

  const showCounter = (hasNewServices() && showWishlistItemsCountBadge)
    || (!hasNewServices() && showConfiguredCounter);
  const text = i18n.text(label);

  return {
    portalProps: {
      favoritesCount,
      showWishlistItemsCountBadge,
      widgetSettings: { showCounter: showConfiguredCounter },
    },
    ariaLabel: showCounter ? `${getCountAriaLabel(text, favoritesCount)} ` : `${text}.  `,
    badge: (
      <FavoritesIconBadge
        favoritesCount={favoritesCount}
        showWishlistItemsCountBadge={showWishlistItemsCountBadge}
        showCounter={showConfiguredCounter}
      />
    ),
  };
};
