import type { NavigationActionSettings } from '@shopgate/engage/settings/types/appSettings';

export type { NavigationActionSettings };

/**
 * A header or tab bar action, resolved for the current page.
 */
export interface ResolvedNavigationAction {
  /** Whether the action can run on the current page. Unavailable actions are not rendered. */
  available: boolean;
  /** Key of the theme icon shown when the merchant did not pick one. */
  icon: string;
  /** I18n key of the accessible label. */
  label: string;
  onClick: () => void;
  /** Number shown in a badge on the icon. */
  badgeCount?: number;
}

/**
 * A hook that resolves one action. Registered by the core or by extensions.
 */
export type NavigationActionHook = (settings: NavigationActionSettings) => ResolvedNavigationAction;
