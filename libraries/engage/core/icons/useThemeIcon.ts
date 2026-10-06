import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { CORE_ICONS } from './coreIcons';

/**
 * Resolves the markup of an icon. The theme config of the shop wins, the core default fills in
 * icons the theme config does not define.
 * @param name The name of the icon.
 * @returns The svg markup, or null for an unknown icon.
 */
export const getThemeIcon = (name: string): string | null => {
  const icons = (themeConfig as { icons?: Record<string, string> })?.icons;
  const shopIcon = icons?.[name];

  if (shopIcon) {
    return shopIcon;
  }

  return (CORE_ICONS as Record<string, string>)[name] ?? null;
};

/**
 * Resolves the markup of an icon by its name.
 * @param name The name of the icon.
 * @returns The svg markup, or null for an unknown icon.
 */
const useThemeIcon = (name: string): string | null => getThemeIcon(name);

export default useThemeIcon;
