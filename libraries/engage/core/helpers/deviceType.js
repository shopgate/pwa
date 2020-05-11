import { hasWebBridge } from './bridge';
import {
  DEVICE_TYPE_SMARTPHONE,
  DEVICE_TYPE_TABLET,
} from '../constants/deviceTypes';

/**
 * Determines the type of the current device.
 * @returns {string}
 */
export const getDeviceType = () => (hasWebBridge() ? DEVICE_TYPE_TABLET : DEVICE_TYPE_SMARTPHONE);
