import Color from 'color';
import { broadcastEvent } from '../index';

/**
 * Updates the styles of the navigation bar of iOS devices.
 * @param {Object} options Options for the status bar.
 */
export const updateLegacyNavigationBar = (options = {}) => {
  const targetTab = options.targetTab || 'main';
  const styles = {
    ...options.color && { color: options.color },
    ...options.background && { background: options.background },
    ...options.buttonColor && { buttonColor: options.buttonColor },
    ...options.buttonColorDisabled && { buttonColorDisabled: options.buttonColorDisabled },
  };

  let statusBarStyle;

  if (options.statusBarStyle) {
    ({ statusBarStyle } = options);
  } else if (options.background) {
    statusBarStyle = Color(options.background).isDark() ? 'light' : 'dark';
  }

  broadcastEvent({
    event: 'updateNavigationBarStyle',
    parameters: [{
      ...statusBarStyle && { statusBarStyle },
      targetTab,
      styles,
    }],
  });
};

