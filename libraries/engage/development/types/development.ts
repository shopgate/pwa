/**
 * Additional styles the app sends along with a status bar style update.
 */
export interface StatusBarStyleStyles {
  /**
   * Current background color of the app bar.
   */
  statusBarBackground?: string;
}

/**
 * The status bar style the app last reported through the `devInternalUpdateStatusBarStyle` event.
 */
export interface StatusBarStyle {
  /**
   * Whether the style is the default one which was initially applied.
   */
  isDefault?: boolean;
  /**
   * The status style for the iOS status bar.
   */
  statusBarStyle?: 'light' | 'dark' | 'none';
  /**
   * Additional styles for the status bar.
   */
  styles?: StatusBarStyleStyles;
}

/**
 * Settings the development tools maintain. Everything but the CMS 2.0 preview is development only -
 * the reducer refuses to write those outside a development build.
 */
export interface DevelopmentSettingsState {
  /**
   * Whether simulated iOS safe area insets are shown. `null` while nobody decided, which lets
   * simulated iOS devices default to showing them.
   */
  showInsets: boolean | null;
  /**
   * Whether the simulated safe area insets are highlighted.
   */
  showInsetHighlight: boolean;
  /**
   * Whether the CMS 2.0 preview is enabled.
   */
  cms2PreviewEnabled: boolean;
  /**
   * Whether a color scheme may be selected without the app settings allowing it.
   */
  colorSchemeSelectionEnabled: boolean;
}

/**
 * Values the development tools store for inspection rather than to drive behaviour.
 */
export interface DevelopmentStorageState {
  /**
   * The status bar style the app last reported.
   */
  statusBarStyle: StatusBarStyle;
}

/**
 * The slice of the application state the development selectors read from.
 */
export interface DevelopmentState {
  development: {
    settings: DevelopmentSettingsState;
    storage: DevelopmentStorageState;
  };
}
