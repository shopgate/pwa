import { CORE_NAVIGATION_ACTIONS } from './actions';
import type { NavigationActionHook } from './types';

const actions = new Map<string, NavigationActionHook>();

/**
 * Registers an action that header buttons and tab bar entries can run. An action registered under
 * the name of a core action replaces it.
 * @param name The name the action is configured with.
 * @param useAction Hook that resolves the action for the current page.
 */
export const registerNavigationAction = (name: string, useAction: NavigationActionHook) => {
  actions.set(name, useAction);
};

/**
 * Looks up an action. A registered action wins over the core action of the same name.
 * @param name The configured name of the action.
 * @returns The hook of the action, if there is one.
 */
export const getNavigationAction = (name: string): NavigationActionHook | undefined =>
  actions.get(name) ?? CORE_NAVIGATION_ACTIONS[name];
