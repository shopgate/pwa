import type { ComponentType } from 'react';
import ThemeIcon from '@shopgate/engage/icons/components/ThemeIcon';
import { resolveIcon } from '@shopgate/engage/icons/helpers';

const actionIcons = new Map<string, ComponentType>();

/**
 * Resolves the icon component of a header button.
 * @param name The name of the icon.
 * @returns The icon component, or null when no icon has that name.
 */
export const getActionIcon = (name: string): ComponentType | null => {
  if (!name) {
    return null;
  }

  if (!actionIcons.has(name)) {
    if (!resolveIcon(name)) {
      return null;
    }

    /**
     * Renders the icon of a header button.
     * @returns The icon.
     */
    const ActionIcon = () => <ThemeIcon name={name} />;
    actionIcons.set(name, ActionIcon);
  }

  return actionIcons.get(name) ?? null;
};
