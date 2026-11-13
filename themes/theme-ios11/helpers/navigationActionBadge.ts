import type { ResolvedNavigationAction } from '@shopgate/engage/navigation/types';

const DEFAULT_BADGE_MAX = 99;

/**
 * The badge of a resolved action, as the tab bar and the header render it.
 */
export interface NavigationActionBadge {
  /**
   * The number of the badge, at least 0. The badge is only shown while it is above 0.
   */
  count: number;
  /**
   * Counts above this are shown as `{max}+`.
   */
  max: number;
  /**
   * Whether the badge shows the number, a dot otherwise.
   */
  showCount: boolean;
  /**
   * Accessible name of the action while the badge is shown. Unset when the label is enough.
   */
  ariaLabel?: string;
}

/**
 * Reads the badge of a resolved action and the accessible name that announces it.
 * @param action The resolved action.
 * @param label The translated label of the action.
 * @returns The badge and the accessible name.
 */
export const getNavigationActionBadge = (
  action: ResolvedNavigationAction,
  label: string
): NavigationActionBadge => {
  const {
    badgeShowCount = true,
    badgeMax = DEFAULT_BADGE_MAX,
    badgeLabel,
  } = action;
  const count = Math.max(action.badgeCount ?? 0, 0);
  const fallbackLabel = badgeShowCount ? `${label}, ${count}` : undefined;

  return {
    count,
    max: badgeMax,
    showCount: badgeShowCount,
    ariaLabel: count > 0 ? badgeLabel || fallbackLabel : undefined,
  };
};
