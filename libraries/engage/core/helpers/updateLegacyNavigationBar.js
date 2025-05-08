import Color from 'color';
import { isAvailable, StatusBar } from '@shopgate/native-modules';
import { broadcastEvent } from '@shopgate/engage/core/commands';
import { isDev } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
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
    if (styles.statusBarBackground === 'transparent') {
      statusBarStyle = 'none';
    } else {
      statusBarStyle = Color(styles.statusBarBackground).isDark() ? 'light' : 'dark';
    }
  }

  // Status bar update via native-modules deactivated for now since it doesn't work
  // reliable when opening a page inside the In-App-Browser.
  if (false && isAvailable()) {
    const style = statusBarStyle === 'dark' ? 'dark-content' : 'light-content';

    StatusBar.setBarStyle({ style });

    if (styles.statusBarBackground) {
      StatusBar.setBackgroundColor({ color: styles.statusBarBackground });
    }

    return;
  }

  const payload = {
    ...statusBarStyle && { statusBarStyle },
    ...isDefault && { isDefault },
    targetTab,
    styles,
  };
  broadcastEvent({
    event: 'updateNavigationBarStyle',
    parameters: [payload],
  });

  if (isDev) {
    // Dispatch the payload in dev as regular event, so that simulated top inset can adopt the color
    UIEvents.emit('devInternalUpdateStatusBarStyle', payload);
  }
};
