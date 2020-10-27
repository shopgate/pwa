import Color from 'color';
import { isAvailable, StatusBar } from '@shopgate/native-modules';
import broadcastEvent from '@shopgate/pwa-core/commands/broadcastEvent';

/**
 * Updates the styles of the navigation bar of iOS devices.
 * @param {Object} options Options for the status bar.
 */
export const updateLegacyNavigationBar = (options = {}) => {
  const targetTab = options.targetTab || 'main';
  const { isDefault } = options;
  const styles = {
    ...options.color && { color: options.color },
    ...options.background && { background: options.background },
    ...options.buttonColor && { buttonColor: options.buttonColor },
    ...options.buttonColorDisabled && { buttonColorDisabled: options.buttonColorDisabled },
    ...options.statusBarBackground && { statusBarBackground: options.statusBarBackground },
  };

  if (!styles.statusBarBackground && styles.background) {
    styles.statusBarBackground = styles.background;
  }

  let statusBarStyle;

  if (options.statusBarStyle) {
    ({ statusBarStyle } = options);
  } else if (styles.statusBarBackground) {
    statusBarStyle = Color(styles.statusBarBackground).isDark() ? 'light' : 'dark';
  }

  if (isAvailable()) {
    const style = statusBarStyle === 'dark' ? 'dark-content' : 'light-content';

    StatusBar.setBarStyle({ style });

    if (styles.statusBarBackground) {
      StatusBar.setBackgroundColor({ color: styles.statusBarBackground });
    }

    return;
  }

  broadcastEvent({
    event: 'updateNavigationBarStyle',
    parameters: [{
      ...statusBarStyle && { statusBarStyle },
      ...isDefault && { isDefault },
      targetTab,
      styles,
    }],
  });
};
