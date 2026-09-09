import { useSelector } from 'react-redux';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import {
  getAreAppSettingsHydrated,
  getShowFavoritesCounter,
} from '@shopgate/engage/settings/selectors/appSettings';

const FAVORITES_ICON_BADGE_WIDGET_ID = '@shopgate/theme-ios11/components/TabBar/FavoritesIconBadge';

/**
 * Resolves whether the favorites tab bar icon renders the number of favorites within its badge.
 * @returns Whether the counter is shown.
 */
export const useShowFavoritesCounter = (): boolean => {
  const areAppSettingsHydrated = useSelector(getAreAppSettingsHydrated);
  const showCounter = useSelector(getShowFavoritesCounter);

  const { showCounter: legacyShowCounter } =
    (useWidgetSettings(FAVORITES_ICON_BADGE_WIDGET_ID) || {}) as { showCounter?: boolean };

  if (!areAppSettingsHydrated) {
    return legacyShowCounter ?? true;
  }

  return showCounter;
};
