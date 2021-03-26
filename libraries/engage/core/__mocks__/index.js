/* eslint-disable require-jsdoc */
export * from '../helpers/__mocks__/i18n';

export * from '../config/__mocks__/config.selectors';

export const getPlatform = () => 'android';
export const getUserAgent = () => 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36';
export const useScrollContainer = () => true;
export const withForwardedRef = jest.fn(Component => Component);
export const hasWebBridge = () => false;
export const isBeta = () => false;
export const getThemeSettings = () => {};
export const grantCameraPermissions = jest.fn().mockResolvedValue(true);
/* eslint-enable require-jsdoc */
