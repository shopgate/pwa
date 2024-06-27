// --------------- CORE --------------- //

// Emitters
export { default as UIEvents } from '@shopgate/pwa-core/emitters/ui';

// --------------- STORE --------------- //

export * from '@shopgate/pwa-common/store';

// --------------- CONTEXTS --------------- //

export * from '@shopgate/pwa-common/context';
export { default as AppContext } from './contexts/AppContext';

// --------------- PROVIDERS --------------- //

export { default as LoadingProvider } from '@shopgate/pwa-common/providers/loading';
export { default as LoadingContext } from '@shopgate/pwa-common/providers/loading/context';
export { default as ToastProvider } from '@shopgate/pwa-common/providers/toast';
export { default as ToastContext } from '@shopgate/pwa-common/providers/toast/context';
export { default as AppProvider } from './providers/AppProvider';

// --------------- MODAL --------------- //

// HOCs
export { default as withShowModal } from '@shopgate/pwa-common/helpers/modal/withShowModal';

// --------------- HOOKS --------------- //

export { useRoute } from './hooks/useRoute';
export { useTheme } from './hooks/useTheme';
export { useCurrentProduct } from './hooks/useCurrentProduct';
export { useNavigation } from './hooks/useNavigation';
export { usePageConfig } from './hooks/usePageConfig';
export { usePageSettings } from './hooks/usePageSettings';
export { useWidgetConfig } from './hooks/useWidgetConfig';
export { useWidgetSettings } from './hooks/useWidgetSettings';
export { useWidgetStyles } from './hooks/useWidgetStyles';
export * from './hooks/html';

// --------------- HOCs --------------- //

export { withTheme } from './hocs/withTheme';
export { withRoute } from './hocs/withRoute';
export { withCurrentProduct } from './hocs/withCurrentProduct';
export { withForwardedRef } from './hocs/withForwardedRef';
export { withNavigation } from './hocs/withNavigation';
export { withWidgetSettings } from './hocs/withWidgetSettings';
export { withWidgetStyles } from './hocs/withWidgetStyles';
export { withApp } from './hocs/withApp';

// --------------- CONFIG --------------- //
export { ThemeConfigResolver } from './config/ThemeConfigResolver';
export { isBeta } from './config/isBeta';
export { getThemeConfig } from './config/getThemeConfig';
export { getThemeSettings } from './config/getThemeSettings';
export { getThemeColors } from './config/getThemeColors';
export { getThemeAssets } from './config/getThemeAssets';
export { getPageConfig } from './config/getPageConfig';
export { getPageSettings } from './config/getPageSettings';
export { getWidgetConfig } from './config/getWidgetConfig';
export { getWidgetSettings } from './config/getWidgetSettings';

export * from './actions';
export * from './classes';
export * from './commands';
export * from './collections';
export * from './constants';
export * from './helpers';
export * from './initialization';
export * from './selectors';
export * from './streams';
