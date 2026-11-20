import type { IconCatalog } from '../types';
import { hiddenCoreIcons } from '../defaults/coreIcons';
import { clampScale } from './iconOptions';
import { getIconDefinition, getIconNames, getIconOrigin } from './registry';
import { getLegacyIconOverride } from './resolveIcon';

const hiddenIcons = new Set<string>(hiddenCoreIcons);

/**
 * Creates the catalog of icons a merchant can replace, for the admin preview.
 * @returns The icon catalog.
 */
export const getIconCatalog = (): IconCatalog => ({
  version: 1,
  icons: getIconNames()
    .filter(name => !hiddenIcons.has(name))
    .map((name) => {
      const legacyOverride = getLegacyIconOverride(name);
      const definition = getIconDefinition(name);
      const defaultScale = clampScale(definition?.scale ?? 1);

      return {
        name,
        source: getIconOrigin(name),
        default: definition?.svg ?? '',
        ...(legacyOverride ? { legacyOverride } : {}),
        ...(defaultScale !== 1 ? { defaultScale } : {}),
      };
    }),
});
