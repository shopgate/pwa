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
  /**
   * Whether the badge shows the number. Default `true`; `false` shows a dot without a number,
   * as long as `badgeCount` is above 0.
   */
  badgeShowCount?: boolean;
  /**
   * Counts above this are shown as `{badgeMax}+`.
   * Default 99.
   */
  badgeMax?: number;
  /**
   * Accessible name while the badge is shown: translated text with the count, not an i18n key.
   * Default: the label and the count, or only the label in dot mode.
   */
  badgeLabel?: string;
  /**
   * Whether the current page belongs to the action. Tabs highlight it.
   */
  isActive?: boolean;
}

/**
 * A hook that resolves one action. Registered by the core or by extensions.
 */
export type NavigationActionHook = (settings: NavigationActionSettings) => ResolvedNavigationAction;

/**
 * Details of a registered action beyond the hook.
 */
export interface NavigationActionMeta {
  /**
   * Makes the action available as a tab bar item.
   */
  tabBar?: {
    /**
     * I18n key or plain text, shown in the tab and the admin catalog.
     */
    label: string;
    /**
     * Name of a registered icon, the default icon of the tab.
     */
    icon: string;
    /**
     * Label shown only in the admin, keyed by admin locale, e.g. `{ 'en-us': 'Customer card' }`.
     * Plain strings, not translated by the app.
     */
    adminLabel?: Record<string, string>;
  };
}

/**
 * An extension action that merchants can add to the tab bar.
 */
export interface NavigationCatalogItem {
  /**
   * The name the action is registered under.
   */
  action: string;
  /**
   * The translated label.
   */
  label: string;
  /**
   * Name of the default icon.
   */
  icon: string;
  /**
   * Admin-only label, keyed by admin locale, passed on untranslated.
   * Missing when the action has none; the admin then shows `label`.
   */
  adminLabel?: Record<string, string>;
}

/**
 * What the admin needs to configure the navigation, reported by the preview.
 */
export interface NavigationCatalog {
  /**
   * What the admin needs to configure the tab bar.
   */
  tabBar: {
    /**
     * The items the app renders while the merchant configured none.
     */
    defaultItems: NavigationActionSettings[];
    /**
     * Registered extension actions that can be added to the tab bar.
     */
    extensionItems: NavigationCatalogItem[];
  };
}
