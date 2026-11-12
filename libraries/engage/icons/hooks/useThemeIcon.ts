import { useEffect, useMemo, useState } from 'react';
import { getIconOverrides, subscribeToIconOverrides } from '../helpers/overrides';
import { resolveIcon } from '../helpers/resolveIcon';
import type { IconName, ResolvedIcon } from '../types';

/**
 * Resolves an icon by its name and updates when the icon overrides change, e.g. in the admin
 * preview.
 * @param name The icon name.
 * @returns The resolved icon, or null when no icon has that name.
 */
export const useThemeIcon = (name: IconName): ResolvedIcon | null => {
  const [overrides, setOverrides] = useState(getIconOverrides);

  useEffect(() => {
    setOverrides(getIconOverrides());

    return subscribeToIconOverrides(() => setOverrides(getIconOverrides()));
  }, []);

  return useMemo(() => resolveIcon(name, overrides), [name, overrides]);
};
