import type { NavigationActionHook } from './types';

const actions = new Map<string, NavigationActionHook>();
const defaults = new Map<string, NavigationActionHook>();

/**
 * Registers an action that header buttons and tab bar entries can run.
 * @param name The name the action is configured with.
 * @param useAction Hook that resolves the action for the current page.
 */
export const registerNavigationAction = (name: string, useAction: NavigationActionHook) => {
  actions.set(name, useAction);
};

/**
 * Registers the core implementation of an action. An action registered through
 * {@link registerNavigationAction} replaces it, regardless of the order of registration.
 * @param name The name the action is configured with.
 * @param useAction Hook that resolves the action for the current page.
 */
export const registerDefaultNavigationAction = (name: string, useAction: NavigationActionHook) => {
  defaults.set(name, useAction);
};

/**
 * Looks up a registered action.
 * @param name The configured name of the action.
 * @returns The hook of the action, if one is registered.
 */
export const getNavigationAction = (name: string): NavigationActionHook | undefined =>
  actions.get(name) ?? defaults.get(name);
