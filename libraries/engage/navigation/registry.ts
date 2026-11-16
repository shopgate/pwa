import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { CORE_NAVIGATION_ACTIONS } from './actions';
import { DEFAULT_TAB_BAR_ITEMS } from './constants';
import type { NavigationActionHook, NavigationActionMeta, NavigationCatalog } from './types';

const actions = new Map<string, {
  useAction: NavigationActionHook;
  meta?: NavigationActionMeta;
}>();

/**
 * Registers an action that header buttons and tab bar entries can run. An action registered under
 * the name of a core action replaces it in header buttons and the scanner button of the search
 * field; core tabs stay as they are. A registered action never adds itself to the tab bar, the
 * merchant adds it.
 * @param name The name the action is configured with.
 * @param useAction Hook that resolves the action for the current page.
 * @param meta Details of the action, e.g. the text and icon of its tab (`tabBar`), which tabs use
 * instead of the hook's `label` and `icon`.
 */
export const registerNavigationAction = (
  name: string,
  useAction: NavigationActionHook,
  meta?: NavigationActionMeta
) => {
  actions.set(name, {
    useAction,
    meta,
  });
};

/**
 * Looks up an action. A registered action wins over the core action of the same name.
 * @param name The configured name of the action.
 * @returns The hook of the action, if there is one.
 */
export const getNavigationAction = (name: string): NavigationActionHook | undefined =>
  actions.get(name)?.useAction ?? CORE_NAVIGATION_ACTIONS[name];

/**
 * Looks up the details a registered action was registered with.
 * @param name The configured name of the action.
 * @returns The details of the action, if it has any.
 */
export const getNavigationActionMeta = (name: string): NavigationActionMeta | undefined =>
  actions.get(name)?.meta;

/**
 * Checks whether an action is an extension action that merchants can add to the tab bar.
 * @param name The configured name of the action.
 * @returns Whether the action is no core action and was registered with tab details.
 */
export const isTabBarExtensionAction = (name: string): boolean => (
  !CORE_NAVIGATION_ACTIONS[name] && !!actions.get(name)?.meta?.tabBar
);

/**
 * Copies the admin labels of a tab, keeping only entries with a string key and a string value.
 * @param adminLabel The admin labels the action was registered with.
 * @returns A new map with the valid entries, or `undefined` when none remain.
 */
const copyAdminLabel = (adminLabel: unknown): Record<string, string> | undefined => {
  if (!adminLabel || typeof adminLabel !== 'object' || Array.isArray(adminLabel)) {
    return undefined;
  }

  const entries = Object.entries(adminLabel)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string');

  return entries.length ? Object.fromEntries(entries) : undefined;
};

/**
 * Creates the catalog of the navigation, for the admin preview: the default tab bar items and the
 * registered extension actions that can be added to the tab bar.
 * @returns The navigation catalog.
 */
export const getNavigationCatalog = (): NavigationCatalog => ({
  tabBar: {
    defaultItems: DEFAULT_TAB_BAR_ITEMS.map(item => ({ ...item })),
    extensionItems: Array.from(actions).flatMap(([action, { meta }]) => {
      if (!meta?.tabBar || !isTabBarExtensionAction(action)) {
        return [];
      }

      const adminLabel = copyAdminLabel(meta.tabBar.adminLabel);

      return [{
        action,
        label: i18n.text(meta.tabBar.label),
        icon: meta.tabBar.icon,
        ...(adminLabel && { adminLabel }),
      }];
    }),
  },
});
