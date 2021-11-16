import { hasWebBridge } from './bridge';
import {
  DEVICE_TYPE_SMARTPHONE,
  DEVICE_TYPE_TABLET,
} from '../constants/deviceTypes';

/**
 * Determines the type of device that should be used for CMS pages.
 * @returns {string}
 */
export const getDeviceTypeForCms = () => (
  // use the CMS pages configured for tablets for the storefront website
  hasWebBridge() ? DEVICE_TYPE_TABLET : DEVICE_TYPE_SMARTPHONE
);
