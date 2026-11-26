import { getIconOverrides as selectIconOverrides } from '@shopgate/engage/settings/selectors/appSettings';
import type { AppSettingsState } from '@shopgate/engage/settings/types/appSettings';
import { setThemeIconResolver } from '../helpers/themeIcons';
import { setIconOverrides } from '../helpers/overrides';
import { resolveIcon } from '../helpers/resolveIcon';

interface IconStore {
  getState: () => unknown;
  subscribe: (listener: () => void) => unknown;
}

/**
 * Keeps the icon overrides in sync with the app settings and lets `themeConfig.icons` resolve
 * icons the same way the icon components do.
 * @param store The redux store.
 */
export const initializeIcons = (store: IconStore) => {
  /**
   * Hands the icon overrides of the current app settings to the icon components.
   */
  const sync = () => {
    setIconOverrides(selectIconOverrides(store.getState() as AppSettingsState));
  };

  sync();
  store.subscribe(sync);

  setThemeIconResolver(name => resolveIcon(name)?.svg ?? null);
};
