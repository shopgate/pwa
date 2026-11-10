import memoize from 'lodash/memoize';
import { getLegacyThemeIcons } from './themeIcons';
import { legacyDefaultHashes } from '../defaults/legacyDefaultHashes';
import type { IconOverrides, ResolvedIcon } from '../types';
import { collapseMarkup, hashString } from './_internal/hash';
import { pickIconOptions } from './iconOptions';
import { getIconOverrides } from './overrides';
import { getIconDefinition, isCoreIcon } from './registry';

const isLegacyDefault = memoize((markup: string) => (
  legacyDefaultHashes.has(hashString(collapseMarkup(markup)))
));

const LEGACY_ICON_NAMES: Record<string, string> = {
  shipping: 'localShipping',
};

/**
 * Returns an icon a merchant customized in the theme extension config. Values that equal a
 * default this config ever shipped are no customization, since deployed configs contain those too.
 * Renamed icons are looked up by the name the config used.
 * @param name The icon name.
 * @returns The markup, or null when the icon was not customized there.
 */
export const getLegacyIconOverride = (name: string) => {
  const legacyIcons = getLegacyThemeIcons();
  const legacyName = Object.prototype.hasOwnProperty.call(LEGACY_ICON_NAMES, name)
    ? LEGACY_ICON_NAMES[name]
    : name;
  const markup = Object.prototype.hasOwnProperty.call(legacyIcons, legacyName)
    ? legacyIcons[legacyName]
    : null;

  if (typeof markup !== 'string' || !markup.trim()) {
    return null;
  }

  return isLegacyDefault(markup) ? null : markup;
};

/**
 * Resolves an icon by its name: an override from the app settings first, then an icon the
 * merchant customized in the theme extension config, then the default of the icon.
 * @param name The icon name.
 * @param overrides The icon overrides of the app settings.
 * @returns The resolved icon, or null when no icon has that name.
 */
export const resolveIcon = (
  name: string,
  overrides: IconOverrides = getIconOverrides()
): ResolvedIcon | null => {
  const override = Object.prototype.hasOwnProperty.call(overrides, name)
    ? overrides[name]
    : undefined;

  if (typeof override?.svg === 'string' && override.svg.trim()) {
    return {
      svg: override.svg,
      ...pickIconOptions(override),
      source: 'override',
      normalize: true,
    };
  }

  const legacy = getLegacyIconOverride(name);

  if (legacy) {
    return {
      svg: legacy,
      keepColors: false,
      source: 'legacy',
      normalize: true,
    };
  }

  const definition = getIconDefinition(name);

  if (!definition) {
    return null;
  }

  return {
    svg: definition.svg,
    keepColors: definition.keepColors ?? false,
    source: 'default',
    normalize: !isCoreIcon(name),
  };
};
