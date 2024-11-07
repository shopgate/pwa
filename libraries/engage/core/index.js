/** @module core */
// --------------- CORE --------------- //

// Emitters
export { default as UIEvents } from '@shopgate/pwa-core/emitters/ui';

// --------------- STORE --------------- //

export * from '@shopgate/pwa-common/store';

// --------------- CONFIG --------------- //
export { ThemeConfigResolver } from './config/ThemeConfigResolver';
export { getThemeConfig } from './config/getThemeConfig';
export { getThemeSettings } from './config/getThemeSettings';
export { getThemeColors } from './config/getThemeColors';
export { getThemeAssets } from './config/getThemeAssets';
export { getPageConfig } from './config/getPageConfig';
export { getPageSettings } from './config/getPageSettings';
export { getWidgetConfig } from './config/getWidgetConfig';
export { getWidgetSettings } from './config/getWidgetSettings';

export * from './actions';
export * from './action-creators';
export * from './classes';
export * from './collections';
export * from './commands';
export * from './constants';
export * from './contexts';
export * from './helpers';
export * from './hocs';
export * from './hooks';
export * from './initialization';
export * from './providers';
export * from './selectors';
export * from './streams';
export * from './validation';
