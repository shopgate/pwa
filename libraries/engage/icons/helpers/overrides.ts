import type { IconOverrides } from '../types';

const EMPTY_OVERRIDES: IconOverrides = {};

let overrides = EMPTY_OVERRIDES;

const listeners = new Set<() => void>();

/**
 * Returns the icon overrides of the app settings. Kept outside of the redux store, so icons
 * also resolve where no store is reachable, e.g. in markup rendered with renderToString.
 * @returns The icon overrides.
 */
export const getIconOverrides = () => overrides;

/**
 * Replaces the icon overrides and notifies the subscribers.
 * @param nextOverrides The new icon overrides.
 */
export const setIconOverrides = (nextOverrides: IconOverrides | null | undefined) => {
  const next = nextOverrides ?? EMPTY_OVERRIDES;

  if (next === overrides) {
    return;
  }

  overrides = next;
  listeners.forEach(listener => listener());
};

/**
 * Subscribes to changes of the icon overrides.
 * @param listener Invoked after the overrides changed.
 * @returns A function that removes the subscription.
 */
export const subscribeToIconOverrides = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
