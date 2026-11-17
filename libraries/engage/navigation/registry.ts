import { isDev, logger } from '@shopgate/engage/core/helpers';
import { i18n } from '@shopgate/engage/core/helpers/i18n';
import { CORE_NAVIGATION_ACTIONS } from './actions';
import { DEFAULT_TAB_BAR_ITEMS } from './constants';
import type {
  NavigationActionHook,
  NavigationActionMeta,
  NavigationCatalog,
  NavigationCatalogItem,
  NavigationPlacement,
} from './types';

const actions = new Map<string, {
  useAction: NavigationActionHook;
  meta?: NavigationActionMeta;
}>();

/**
 * Warns in development about tab details without a string label or icon.
 * @param name The name the action is registered under.
 * @param tabBar The tab details the action is registered with.
 */
const warnInvalidTabBarMeta = (name: string, tabBar: NavigationActionMeta['tabBar']) => {
  if (!isDev || !tabBar) {
    return;
  }

  if (typeof tabBar.label !== 'string') {
    logger.warn(`registerNavigationAction: "${name}" has no string tabBar.label, so the admin doesn't offer it and the tab bar leaves it out`);
  }

  if (typeof tabBar.icon !== 'string') {
    logger.warn(`registerNavigationAction: "${name}" has no string tabBar.icon, so its tab falls back to the icon of the action`);
  }
};

/**
 * Registers an action that header buttons and tab bar entries can run. An action registered under
 * the name of a core action replaces it in header buttons and the scanner button of the search
 * field; core tabs stay as they are. A registered action never adds itself to the tab bar, the
 * merchant adds it. Register it in an `appWillStart$` subscriber, before the app renders: the tab
 * bar drops configured items of actions registered later.
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
  warnInvalidTabBarMeta(name, meta?.tabBar);
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
 * Looks up the details of a placement for an extension action that merchants can add to it.
 * @param name The configured name of the action.
 * @param placement The placement, e.g. `tabBar`.
 * @returns The details of the placement, unless the action is a core action or has none with a
 * string label.
 */
export const getExtensionActionMeta = <P extends NavigationPlacement>(
  name: string,
  placement: P
): NavigationActionMeta[P] | undefined => {
  if (CORE_NAVIGATION_ACTIONS[name]) {
    return undefined;
  }

  const placementMeta = actions.get(name)?.meta?.[placement];

  return typeof placementMeta?.label === 'string' ? placementMeta : undefined;
};

/**
 * Checks whether an action is an extension action that merchants can add to a placement.
 * @param name The configured name of the action.
 * @param placement The placement, e.g. `tabBar`.
 * @returns Whether the action is no core action and was registered with details of the placement
 * that have a string label.
 */
export const isExtensionActionFor = (name: string, placement: NavigationPlacement): boolean => (
  !!getExtensionActionMeta(name, placement)
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
 * Lists the registered extension actions that merchants can add to a placement. Actions without a
 * string label are left out.
 * @param placement The placement, e.g. `tabBar`.
 * @returns The catalog items of the actions.
 */
const getExtensionCatalogItems = (placement: NavigationPlacement): NavigationCatalogItem[] => (
  Array.from(actions.keys()).flatMap((action) => {
    const placementMeta = getExtensionActionMeta(action, placement);

    if (!placementMeta) {
      return [];
    }

    const adminLabel = copyAdminLabel(placementMeta.adminLabel);

    return [{
      action,
      label: i18n.text(placementMeta.label),
      icon: typeof placementMeta.icon === 'string' ? placementMeta.icon : '',
      ...(adminLabel && { adminLabel }),
    }];
  })
);

/**
 * Creates the catalog of the navigation, for the admin preview: the default tab bar items and the
 * registered extension actions that can be added to the tab bar.
 * @returns The navigation catalog.
 */
export const getNavigationCatalog = (): NavigationCatalog => ({
  tabBar: {
    defaultItems: DEFAULT_TAB_BAR_ITEMS.map(item => ({ ...item })),
    extensionItems: getExtensionCatalogItems('tabBar'),
  },
});
