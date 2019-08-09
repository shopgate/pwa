import Color from 'color';
import { broadcastEvent } from '../index';

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

