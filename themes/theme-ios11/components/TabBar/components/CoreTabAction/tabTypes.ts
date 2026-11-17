import type { ComponentType, ReactNode } from 'react';
import HomeIcon from '@shopgate/pwa-ui-ios/icons/HomeIcon';
import CartIcon from '@shopgate/pwa-ui-ios/icons/CartIcon';
import BrowseIcon from '@shopgate/pwa-ui-shared/icons/BrowseIcon';
import HeartIcon from '@shopgate/pwa-ui-shared/icons/HeartIcon';
import MoreIcon from '@shopgate/pwa-ui-shared/icons/MoreIcon';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
} from '../../constants';
import { CORE_TAB_DATA, CORE_TAB_TYPES } from '../../coreTabData';
import type { CoreTabData, CoreTabTypeName } from '../../coreTabData';
import { useCartTabExtras, useFavoritesTabExtras } from './hooks';

/**
 * What a tab type adds to the common tab: portal props, aria label and badge.
 */
export interface TabExtras {
  /**
   * Props the tab portals get in addition to the tab props. They don't reach `TabBarAction`.
   */
  portalProps: Record<string, unknown>;
  /**
   * Replaces the `aria-label` of the tab.
   */
  ariaLabel?: string;
  /**
   * Rendered after the label of the tab.
   */
  badge?: ReactNode;
}

/**
 * How one core tab type looks and behaves beyond its plain data: default icon and additions.
 */
interface CoreTabPresentation {
  /**
   * The icon shown without a configured icon.
   */
  icon: ComponentType<{
    /**
     * Sets the size of the icon.
     */
    className?: string;
  }>;
  /**
   * Width of the default icon in pixels.
   */
  iconWidth: number;
  /**
   * Height of the default icon in pixels.
   */
  iconHeight: number;
  /**
   * Provides the additions of the tab type.
   */
  useExtras?: (label: string) => TabExtras;
  /**
   * Whether the before portal gets the props without `TabBarAction`, as the cart tab always did.
   */
  beforeWithoutTabBarAction?: boolean;
}

/**
 * Everything about one core tab type: its plain data and its presentation.
 */
type CoreTabType = CoreTabData & CoreTabPresentation;

const CORE_TAB_PRESENTATION: Readonly<Record<CoreTabTypeName, CoreTabPresentation>> = {
  [TAB_HOME]: {
    icon: HomeIcon,
    iconWidth: 24,
    iconHeight: 24,
  },
  [TAB_BROWSE]: {
    icon: BrowseIcon,
    iconWidth: 31,
    iconHeight: 32,
  },
  [TAB_CART]: {
    icon: CartIcon,
    iconWidth: 24,
    iconHeight: 24,
    useExtras: useCartTabExtras,
    beforeWithoutTabBarAction: true,
  },
  [TAB_FAVORITES]: {
    icon: HeartIcon,
    iconWidth: 24,
    iconHeight: 24,
    useExtras: useFavoritesTabExtras,
  },
  [TAB_MORE]: {
    icon: MoreIcon,
    iconWidth: 24,
    iconHeight: 24,
  },
};

export const CORE_TABS = Object.fromEntries(CORE_TAB_TYPES.map(type => [type, {
  ...CORE_TAB_DATA[type],
  ...CORE_TAB_PRESENTATION[type],
}])) as Readonly<Record<CoreTabTypeName, CoreTabType>>;
