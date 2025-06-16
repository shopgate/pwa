/** @module core */

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
export * from './events';
export * from './helpers';

// Only export HOCs that existed before the hoc folder existed
export {
  withShowModal,
  withTheme,
  withRoute,
  withCurrentProduct,
  withForwardedRef,
  withNavigation,
  withWidgetSettings,
  withWidgetStyles,
  withApp,
} from './hocs';
// Only export hooks that existed before the hooks folder existed
export {
  useAsyncMemo,
  useRoute,
  useTheme,
  useApp,
  useCurrentProduct,
  useNavigation,
  usePageConfig,
  usePageSettings,
  useWidgetConfig,
  useWidgetSettings,
  useWidgetStyles,
  useLoadImage,
  usePrevious,
  useResponsiveValue,
} from './hooks';
export * from './initialization';
export * from './providers';
export * from './selectors';
export * from './streams';
export * from './validation';
