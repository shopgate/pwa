import { DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE } from '../constants';
import type { StatusBarStyle } from '../types';

/**
 * Updates the status bar style storage where latest payload from the updateNavigationBarStyle
 * app event is stored.
 * @param style The event payload.
 * @returns The action object.
 */
export const updateStatusBarStyleStorage = (style: StatusBarStyle = {}) => ({
  type: DEVELOPMENT_TOOLS_UPDATE_STATUS_BAR_STYLE_STORAGE,
  style,
} as const);

export type UpdateStatusBarStyleStorageAction = ReturnType<typeof updateStatusBarStyleStorage>;

/**
 * Every action the development storage reducer handles.
 */
export type DevelopmentStorageAction = UpdateStatusBarStyleStorageAction;
