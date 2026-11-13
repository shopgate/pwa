import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { themeConfig } from '@shopgate/engage';
import { UIEvents } from '@shopgate/engage/core/events';
import { useWidgetSettings, useScrollDirectionChange } from '@shopgate/engage/core/hooks';
import { DEFAULT_TAB_BAR_ITEMS, TAB_BAR_MAX_ITEMS } from '@shopgate/engage/navigation/constants';
import { isTabBarExtensionAction } from '@shopgate/engage/navigation/registry';
import {
  getAreAppSettingsHydrated,
  getTabBarItems,
  getTabBarSettings,
} from '@shopgate/engage/settings/selectors/appSettings';
import type {
  AppSettings,
  FooterBarVariant,
  NavigationActionSettings,
} from '@shopgate/engage/settings/types/appSettings';
import {
  HIDE_TAB_BAR,
  SHOW_TAB_BAR,
} from './constants';
import { getTabDefinition } from './tabDefinitions';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

/**
 * The effective TabBar settings, resolved from either the legacy widget
 * settings or the new app settings. Mirrors the app-settings tab bar shape
 * except `favorites`, which is resolved by `useShowFavoritesCounter`.
 */
type TabBarSettings = Omit<AppSettings['navigation']['tabBar'], 'favorites' | 'items'>;

/**
 * Resolves the effective TabBar settings by combining the legacy widget
 * settings with the new app settings. The app settings take priority once
 * they have been hydrated from a source (admin sync / jsonp); until then the
 * legacy widget settings are used.
 *
 * The returned settings are always complete: the legacy widget settings may be
 * empty or omit fields (`useWidgetSettings` returns `{}` when the widget is not
 * configured), so the built-in defaults are applied here.
 * @returns The merged TabBar settings.
 */
export const useTabBarSettings = (): TabBarSettings => {
  // Legacy settings system - baseline configuration. Still uses the legacy
  // 'docked' value for the fixed variant (from extension-config.json).
  const widgetSettings = useWidgetSettings('@shopgate/engage/components/TabBar') as
    Partial<Omit<TabBarSettings, 'variant'> & { variant: 'docked' | 'floating' }>;

  // New app settings system - takes priority once hydrated from a source.
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const tabBarSettings = useSelector(getTabBarSettings);

  return useMemo(() => {
    // Until app settings are hydrated, stick with the legacy widget settings.
    // Those may be empty or partial, so apply the built-in defaults and
    // normalize the legacy 'docked' value to the app-settings vocabulary.
    if (!areAppSettingsHydrated) {
      const {
        transition = 'fade',
        variant = 'docked',
        hideOnScroll = false,
        showLabels = true,
        fixed,
      } = widgetSettings;

      return {
        transition,
        variant: variant === 'floating' ? 'floating' : 'fixed',
        hideOnScroll,
        showLabels,
        fixed: { borderEnabled: fixed?.borderEnabled ?? true },
      };
    }

    // Once hydrated, the app settings cover every field the TabBar reads.
    return {
      transition: tabBarSettings.transition,
      variant: tabBarSettings.variant,
      hideOnScroll: tabBarSettings.hideOnScroll,
      showLabels: tabBarSettings.showLabels,
      fixed: tabBarSettings.fixed,
    };
  }, [areAppSettingsHydrated, tabBarSettings, widgetSettings]);
};

/**
 * Hook to observe scroll events and show/hide the tab bar accordingly.
 * @param isVisible Whether the tab bar is visible (determined by visibility rules).
 */
export const useTabBarScrollObserver = (isVisible: boolean) => {
  const { hideOnScroll = false } = useTabBarSettings();

  useScrollDirectionChange({
    enabled: hideOnScroll && isVisible,
    offset,
    onScrollDown: () => {
      UIEvents.emit(HIDE_TAB_BAR, { scroll: true });
    },
    onScrollUp: () => {
      UIEvents.emit(SHOW_TAB_BAR, { scroll: true });
    },
  });
};

/**
 * Layout of a bar that sits on top of the tab bar.
 */
export interface FooterBarLayout {
  variant: FooterBarVariant;
  /** Space in px between the floating bar and the tab bar. */
  gap: number;
}

/**
 * Resolves how a bar at the bottom of a page is laid out. A floating tab bar makes it float as
 * well, otherwise the configured variant applies.
 * @param variant The configured variant of the bar.
 * @returns The layout.
 */
export const useFooterBarLayout = (variant: FooterBarVariant): FooterBarLayout => {
  const { variant: tabBarVariant } = useTabBarSettings();

  return useMemo<FooterBarLayout>(() => (tabBarVariant === 'floating'
    ? {
      variant: 'floating',
      gap: 8,
    }
    : {
      variant: variant === 'floating' ? 'floating' : 'fixed',
      gap: 16,
    }), [tabBarVariant, variant]);
};

const HOME_ITEM: NavigationActionSettings = {
  action: 'home',
  icon: '',
  link: '',
};

/**
 * Resolves the items the tab bar renders. Without a stored list the default items are used. Items
 * of unknown actions and repeated tabs are dropped, Home is always present and the list is cut at
 * the maximum.
 * @param stored The items the merchant configured, undefined when there are none.
 * @returns The items to render.
 */
export const resolveTabBarItems = (
  stored: NavigationActionSettings[] | undefined
): NavigationActionSettings[] => {
  const seen = new Set<string>();
  const items = (stored ?? DEFAULT_TAB_BAR_ITEMS).filter(({ action }) => {
    const definition = getTabDefinition(action);

    if (!definition && !isTabBarExtensionAction(action)) {
      return false;
    }

    const tab = definition?.type ?? action;

    if (seen.has(tab)) {
      return false;
    }

    seen.add(tab);
    return true;
  });

  const homeIndex = items.findIndex(({ action }) => action === 'home');

  if (homeIndex !== -1 && homeIndex < TAB_BAR_MAX_ITEMS) {
    return items.slice(0, TAB_BAR_MAX_ITEMS);
  }

  const home = homeIndex === -1 ? HOME_ITEM : items[homeIndex];
  const others = items.filter(({ action }) => action !== 'home');

  return [home, ...others].slice(0, TAB_BAR_MAX_ITEMS);
};

/**
 * Resolves the items the tab bar renders from the app settings.
 * @returns The items to render.
 */
export const useTabBarItems = (): NavigationActionSettings[] => {
  const stored = useSelector(getTabBarItems);
  return useMemo(() => resolveTabBarItems(stored), [stored]);
};
