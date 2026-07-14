import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { themeConfig } from '@shopgate/engage';
import { UIEvents } from '@shopgate/engage/core/events';
import { useWidgetSettings, useScrollDirectionChange } from '@shopgate/engage/core/hooks';
import { getAreAppSettingsHydrated, getTabBarSettings } from '@shopgate/engage/settings/selectors/appSettings';
import type { AppSettings } from '@shopgate/engage/settings/types/appSettings';
import {
  HIDE_TAB_BAR,
  SHOW_TAB_BAR,
} from './constants';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

/**
 * The effective TabBar settings, resolved from either the legacy widget
 * settings or the new app settings. Mirrors the app-settings tab bar shape
 * exactly, so {@link AppSettings} stays the single source of truth.
 */
type TabBarSettings = AppSettings['navigation']['tabBar'];

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
        fixedBorderEnabled = true,
      } = widgetSettings;

      return {
        transition,
        variant: variant === 'floating' ? 'floating' : 'fixed',
        hideOnScroll,
        showLabels,
        fixedBorderEnabled,
      };
    }

    // Once hydrated, the app settings cover every field the TabBar reads.
    return {
      transition: tabBarSettings.transition,
      variant: tabBarSettings.variant,
      hideOnScroll: tabBarSettings.hideOnScroll,
      showLabels: tabBarSettings.showLabels,
      fixedBorderEnabled: tabBarSettings.fixedBorderEnabled,
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
