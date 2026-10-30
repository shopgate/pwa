import type { ComponentType } from 'react';
import ThemeIcon from '@shopgate/engage/icons/components/ThemeIcon';
import { resolveIcon } from '@shopgate/engage/icons/helpers';

/**
 * Names the Theme Config offers for header icons that differ from the icon names.
 */
const ICON_ALIASES: Record<string, string> = {
  pin: 'location',
  store: 'locator',
};

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

  const iconName = Object.prototype.hasOwnProperty.call(ICON_ALIASES, name)
    ? ICON_ALIASES[name]
    : name;

  if (!actionIcons.has(iconName)) {
    if (!resolveIcon(iconName)) {
      return null;
    }

    /**
     * Renders the icon of a header button.
     * @returns The icon.
     */
    const ActionIcon = () => <ThemeIcon name={iconName} />;
    actionIcons.set(iconName, ActionIcon);
  }

  return actionIcons.get(iconName) ?? null;
};
