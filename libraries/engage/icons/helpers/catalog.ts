import type { IconCatalog } from '../types';
import { getIconDefinition, getIconNames, getIconOrigin } from './registry';
import { getLegacyIconOverride } from './resolveIcon';

/**
 * Creates the catalog of icons a merchant can replace, for the admin preview.
 * @returns The icon catalog.
 */
export const getIconCatalog = (): IconCatalog => ({
  version: 1,
  icons: getIconNames().map((name) => {
    const legacyOverride = getLegacyIconOverride(name);

    return {
      name,
      source: getIconOrigin(name),
      default: getIconDefinition(name)?.svg ?? '',
      ...(legacyOverride ? { legacyOverride } : {}),
    };
  }),
});
