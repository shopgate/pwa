import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { appConfig } from '@shopgate/engage';
import { hex2bin } from '@shopgate/engage/core/helpers';
import { hasScannerSupport } from '@shopgate/engage/core/selectors';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/engage/scanner/constants';
import { getScannerRoute } from '@shopgate/engage/scanner/helpers';
import { CART_PATH, getCartProductDisplayCount } from '@shopgate/engage/cart';
import { FAVORITES_PATH, getFavoritesCount } from '@shopgate/engage/favorites';
import { ITEM_PATTERN } from '@shopgate/engage/product/constants';
import { STORE_FINDER_PATTERN } from '@shopgate/engage/locations/constants';
import { useRoute, useNavigation } from '@shopgate/engage/core/hooks';
import { UIEvents } from '@shopgate/engage/core/events';
import { useProductShare } from '@shopgate/engage/product/hooks';
import { BROWSE_PATH, OPEN_SEARCH } from '../constants';
import type { NavigationActionHook } from '../types';

const { hasNoScanner, hasFavorites } = (appConfig || {}) as {
  hasNoScanner?: boolean;
  hasFavorites?: boolean;
};

/**
 * Creates a click handler that opens a path.
 * @param pathname The path to open.
 * @returns A click handler that opens the path.
 */
const usePush = (pathname: string) => {
  const { push } = useNavigation();
  return useCallback(() => push({ pathname }), [push, pathname]);
};

const EXTERNAL_LINK = /^[a-z][a-z0-9+.-]*:/i;
const PROTOCOL_RELATIVE_LINK = /^[/\\]{2,}/;

/**
 * Turns the configured target into a path the router can open.
 * @param link The configured target.
 * @returns An external address, or the path of an app page with a leading slash and without
 * fragment.
 */
export const toPathname = (link: unknown): string => {
  const value = typeof link === 'string' ? link.trim() : '';

  if (!value || EXTERNAL_LINK.test(value)) {
    return value;
  }

  if (PROTOCOL_RELATIVE_LINK.test(value)) {
    return `https://${value.replace(PROTOCOL_RELATIVE_LINK, '')}`;
  }

  const [path] = value.split('#');
  return path.startsWith('/') ? path : `/${path}`;
};

const useLinkAction: NavigationActionHook = ({ link }) => {
  const pathname = toPathname(link);
  return {
    available: !!pathname,
    icon: 'browse',
    label: 'navigation.open_link',
    onClick: usePush(pathname),
  };
};

const useOpenSearchAction: NavigationActionHook = () => ({
  available: true,
  icon: 'magnifier',
  label: 'search.label',
  onClick: useCallback(() => {
    UIEvents.emit(OPEN_SEARCH);
  }, []),
});

const useShareAction: NavigationActionHook = () => {
  const route = useRoute() as { pattern?: string; params?: { productId?: string } } | null;
  const productId = route?.pattern === ITEM_PATTERN && route.params?.productId
    ? hex2bin(route.params.productId) as string
    : null;
  const { canShare, share } = useProductShare(productId);
  return {
    available: canShare,
    icon: 'share',
    label: 'product.share',
    onClick: share,
  };
};

const useScannerAction: NavigationActionHook = () => {
  const supported = useSelector(hasScannerSupport) as boolean;
  return {
    available: !hasNoScanner && supported,
    icon: 'barcodeScanner',
    label: 'titles.scanner',
    onClick: usePush(getScannerRoute(SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE)),
  };
};

const useStoreFinderAction: NavigationActionHook = () => ({
  available: true,
  icon: 'pin',
  label: 'titles.store_finder',
  onClick: usePush(STORE_FINDER_PATTERN),
});

const useCartAction: NavigationActionHook = () => ({
  available: true,
  icon: 'cart',
  label: 'navigation.cart',
  onClick: usePush(CART_PATH),
  badgeCount: useSelector(getCartProductDisplayCount) as number,
});

const useFavoritesAction: NavigationActionHook = () => ({
  available: !!hasFavorites,
  icon: 'heart',
  label: 'navigation.favorites',
  onClick: usePush(FAVORITES_PATH),
  badgeCount: useSelector((state: unknown) => (
    getFavoritesCount(state, { useItemQuantity: true }) as number
  )),
});

const useCategoryMenuAction: NavigationActionHook = () => ({
  available: true,
  icon: 'burger',
  label: 'navigation.categories',
  onClick: usePush(BROWSE_PATH),
});

export const CORE_NAVIGATION_ACTIONS: Partial<Record<string, NavigationActionHook>> = {
  link: useLinkAction,
  openSearch: useOpenSearchAction,
  share: useShareAction,
  scanner: useScannerAction,
  storeFinder: useStoreFinderAction,
  cart: useCartAction,
  favorites: useFavoritesAction,
  categoryDrawer: useCategoryMenuAction,
};
