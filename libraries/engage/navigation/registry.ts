import { isDev, logger } from '@shopgate/engage/core/helpers';
import { CORE_NAVIGATION_ACTIONS } from './actions';
import { DEFAULT_TAB_BAR_ITEMS } from './constants';
import { getExtensionActionLabel } from './helpers/getExtensionActionLabel';
import { isObjectRecord } from './helpers/isObjectRecord';
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
 * Warns in development about tab details that are no object or lack a string label or icon.
 * @param name The name the action is registered under.
 * @param tabBar The tab details the action is registered with.
 */
const warnInvalidTabBarMeta = (name: string, tabBar: NavigationActionMeta['tabBar']) => {
  if (!isDev || tabBar === undefined || tabBar === null) {
    return;
  }

  if (!isObjectRecord(tabBar)) {
    logger.warn(`registerNavigationAction: "${name}" has a tabBar that is no object, so it is no tab bar item`);
    return;
  }

  if (typeof tabBar.label !== 'string') {
    logger.warn(`registerNavigationAction: "${name}" has no string tabBar.label, so its tab and its admin item show a fallback text`);
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
 * @param meta Details of the action. `tabBar` makes it a tab bar item, labelled by
 * `getExtensionActionLabel` and shown with `tabBar.icon` instead of the hook's `icon`.
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
 * @returns The details of the placement, unless the action is a core action or has no details
 * object for it. A missing or empty label doesn't matter.
 */
export const getExtensionActionMeta = <P extends NavigationPlacement>(
  name: string,
  placement: P
): NavigationActionMeta[P] | undefined => {
  if (CORE_NAVIGATION_ACTIONS[name]) {
    return undefined;
  }

  const placementMeta = actions.get(name)?.meta?.[placement];

  return isObjectRecord(placementMeta) ? placementMeta : undefined;
};

/**
 * Checks whether an action is an extension action that merchants can add to a placement.
 * @param name The configured name of the action.
 * @param placement The placement, e.g. `tabBar`.
 * @returns Whether the action is no core action and was registered with a details object for the
 * placement, with or without a label.
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
  if (!isObjectRecord(adminLabel)) {
    return undefined;
  }

  const entries = Object.entries(adminLabel)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string');

  return entries.length ? Object.fromEntries(entries) : undefined;
};

/**
 * Lists the registered extension actions that merchants can add to a placement, labelled by
 * `getExtensionActionLabel` without the hook's `label`, which only rendering resolves.
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
      label: getExtensionActionLabel(action, {
        label: placementMeta.label,
        adminLabel,
      }),
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
