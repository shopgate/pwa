import {
  DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
  DEVELOPMENT_TOOLS_TOGGLE_CMS2_PREVIEW,
  DEVELOPMENT_TOOLS_TOGGLE_COLOR_SCHEME_SELECTION,
} from '../constants';

/**
 * Toggles the simulation of iOS safe area insets.
 * @param visible Whether the insets should be visible or not.
 * @returns The action object.
 */
export const toggleInsets = (visible = true) => ({
  type: DEVELOPMENT_TOOLS_TOGGLE_INSETS,
  visible,
} as const);

export type ToggleInsetsAction = ReturnType<typeof toggleInsets>;

/**
 * Toggles the highlighting of the simulated iOS safe area insets.
 * @param visible Whether the insets should be visible or not.
 * @returns The action object.
 */
export const toggleInsetHighlight = (visible = true) => ({
  type: DEVELOPMENT_TOOLS_TOGGLE_INSET_HIGHLIGHT,
  visible,
} as const);

export type ToggleInsetHighlightAction = ReturnType<typeof toggleInsetHighlight>;

/**
 * Toggles the CMS 2.0 preview mode.
 * @param enabled Whether the CMS 2.0 preview should be enabled or not.
 * @returns The action object.
 */
export const toggleCms2Preview = (enabled = true) => ({
  type: DEVELOPMENT_TOOLS_TOGGLE_CMS2_PREVIEW,
  enabled,
} as const);

export type ToggleCms2PreviewAction = ReturnType<typeof toggleCms2Preview>;

/**
 * Toggles whether a color scheme can be selected without the app settings allowing it.
 * @param enabled Whether the selection should be enabled or not.
 * @returns The action object.
 */
export const toggleColorSchemeSelection = (enabled = true) => ({
  type: DEVELOPMENT_TOOLS_TOGGLE_COLOR_SCHEME_SELECTION,
  enabled,
} as const);

export type ToggleColorSchemeSelectionAction = ReturnType<typeof toggleColorSchemeSelection>;

/**
 * Every action the development settings reducer handles.
 */
export type DevelopmentSettingsAction =
  | ToggleInsetsAction
  | ToggleInsetHighlightAction
  | ToggleCms2PreviewAction
  | ToggleColorSchemeSelectionAction;
