import { RECEIVE_APP_SETTINGS } from '../constants';
import type { AppSettings } from '../types/appSettings';
/**
 * Creates the dispatched RECEIVE_APP_SETTINGS action object.
 * @param settings A list of app settings.
 * @returns The dispatched action object.
 */
export const receiveAppSettings = (settings: AppSettings) => ({
  type: RECEIVE_APP_SETTINGS,
  settings,
});

export type ReceiveAppSettingsAction = ReturnType<typeof receiveAppSettings>;
