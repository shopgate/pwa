import { themeConfig } from '@shopgate/engage';
import { CORE_ICONS } from './coreIcons';

/**
 * Resolves the markup of an icon. The theme config of the shop wins, the core default fills in
 * icons the theme config does not define.
 * @param name The name of the icon.
 * @returns The svg markup, or null for an unknown icon.
 */
export const getThemeIcon = (name: string): string | null => {
  const icons = (themeConfig as { icons?: Record<string, unknown> })?.icons ?? {};
  const source = [icons, CORE_ICONS as Record<string, unknown>].find(candidate => (
    Object.prototype.hasOwnProperty.call(candidate, name)
    && typeof candidate[name] === 'string'
    && candidate[name]
  ));

  return source ? source[name] as string : null;
};
