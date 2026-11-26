import type { ComponentType } from 'react';
import ThemeIcon from '@shopgate/engage/icons/components/ThemeIcon';
import { resolveIcon } from '@shopgate/engage/icons/helpers';

const actionIcons = new Map<string, ComponentType>();

/**
 * Resolves the icon component of a header button or a tab.
 * @param name The name of the icon.
 * @returns The icon component, or null when no icon has that name.
 */
export const getActionIcon = (name: string): ComponentType | null => {
  if (!name || !resolveIcon(name)) {
    return null;
  }

  if (!actionIcons.has(name)) {
    /**
     * Renders the icon of a header button or a tab.
     * @returns The icon.
     */
    const ActionIcon = () => <ThemeIcon name={name} />;
    actionIcons.set(name, ActionIcon);
  }

  return actionIcons.get(name) ?? null;
};

/**
 * Takes the place of an icon when none of the given names resolves.
 * @returns Nothing.
 */
export const NoIcon = () => null;

/**
 * Resolves the icon of the first name that has one, e.g. the merchant's icon before the default.
 * @param names The icon names, in order of preference.
 * @returns The icon component, or `NoIcon` when no name has an icon.
 */
export const resolveActionIcon = (...names: string[]): ComponentType => (
  names.reduce<ComponentType | null>((icon, name) => icon ?? getActionIcon(name), null) ?? NoIcon
);
