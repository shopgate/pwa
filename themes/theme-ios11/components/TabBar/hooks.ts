import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { themeConfig } from '@shopgate/engage';
import { UIEvents } from '@shopgate/engage/core/events';
import { useWidgetSettings, useScrollDirectionChange } from '@shopgate/engage/core/hooks';
import { getAreAppSettingsHydrated, getMenubarSettings } from '@shopgate/engage/settings/selectors/appSettings';
import {
  HIDE_TAB_BAR,
  SHOW_TAB_BAR,
} from './constants';

const { variables: { scroll: { offset = 100 } = {} } } = themeConfig || {};

/**
 * The effective TabBar settings, resolved from either the legacy widget
 * settings or the new app settings.
 */
interface TabBarSettings {
  transition: 'fade' | 'slide';
  variant: 'docked' | 'floating';
  hideOnScroll: boolean;
  showLabels: boolean;
}

/**
 * Resolves the effective TabBar settings by combining the legacy widget
 * settings with the new app settings. The app settings take priority once
 * they have been hydrated from a source (admin sync / jsonp); until then the
 * legacy widget settings are used.
 *
 * The returned settings are partial - the legacy widget settings may omit
 * fields, so consumers are expected to apply their own defaults.
 * @returns The merged TabBar settings.
 */
export const useTabBarSettings = (): Partial<TabBarSettings> => {
  // Legacy settings system - baseline configuration.
  const widgetSettings = useWidgetSettings('@shopgate/engage/components/TabBar');

  // New app settings system - takes priority once hydrated from a source.
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const menubarSettings = useSelector(getMenubarSettings);

  return useMemo(() => {
    // Until app settings are hydrated, stick with the legacy widget settings.
    if (!areAppSettingsHydrated) {
      return widgetSettings;
    }

    // Once hydrated, the app settings cover every field the TabBar reads.
    return {
      transition: menubarSettings.transition,
      // menubar.style -> variant: 'fixed' maps to 'docked', 'floating' to 'floating'.
      variant: menubarSettings.style === 'floating' ? 'floating' : 'docked',
      hideOnScroll: menubarSettings.hideOnScroll,
      showLabels: menubarSettings.showLabels,
    };
  }, [areAppSettingsHydrated, menubarSettings, widgetSettings]);
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
