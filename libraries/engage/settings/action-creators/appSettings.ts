import { RECEIVE_APP_SETTINGS } from '../constants/appSettings';
import type { AppSettingsPayload } from '../types/appSettings';
/**
 * Creates the dispatched RECEIVE_APP_SETTINGS action object.
 * @param settings A list of app settings. Partial: a source only sends what is configured.
 * @returns The dispatched action object.
 */
export const receiveAppSettings = (settings: AppSettingsPayload) => ({
  type: RECEIVE_APP_SETTINGS,
  settings,
});

export type ReceiveAppSettingsAction = ReturnType<typeof receiveAppSettings>;
