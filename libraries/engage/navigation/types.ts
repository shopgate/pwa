import type { NavigationActionSettings } from '@shopgate/engage/settings/types/appSettings';

export type { NavigationActionSettings };

/**
 * Locale of the admin, lower case language and region.
 * Known locales are suggested; others are allowed.
 */
export type AdminLocale = 'en-us' | 'de-de' | (string & Record<never, never>);

/**
 * A header or tab bar action, resolved for the current page.
 */
export interface ResolvedNavigationAction {
  /** Whether the action can run on the current page. Unavailable actions are not rendered. */
  available: boolean;
  /**
   * Name of an icon, shown in the header button when the merchant picked none.
   * Tabs use `tabBar.icon` instead.
   */
  icon: string;
  /**
   * I18n key or plain text, the accessible name of the header button, which shows only an icon.
   * May be longer than `tabBar.label`, which tabs use instead.
   */
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
   * Default: `label` (header) or `tabBar.label` (tab) and the count, or only that name in dot mode.
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
   * Makes the action available as a tab bar item. Its `label` and `icon` serve the tab and the
   * admin; the hook's `label` and `icon` serve the header button instead.
   */
  tabBar?: {
    /**
     * I18n key or plain text, the text of the tab and its accessible name; keep it short.
     * Also names the item in the admin when no `adminLabel` fits.
     */
    label: string;
    /**
     * Name of an icon, shown in the tab and the admin when the merchant picked none.
     */
    icon: string;
    /**
     * Admin-only labels by admin locale (`en-us`, `de-de`), not translated by the app. The admin
     * uses its locale, then `en-us`, then `label`, so always set `en-us`.
     */
    adminLabel?: Partial<Record<AdminLocale, string>>;
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
   * The translated `tabBar.label`. The admin shows it when no `adminLabel` fits.
   */
  label: string;
  /**
   * The `tabBar.icon`, the default icon of the item.
   */
  icon: string;
  /**
   * Admin-only labels by admin locale, passed on untranslated. Missing when the action has none;
   * the admin uses its locale, then `en-us`, then `label`.
   */
  adminLabel?: Partial<Record<AdminLocale, string>>;
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
