import { isAvailable, StatusBar } from '@shopgate/native-modules';

/**
 * Hides or shows the native status bar, in apps whose native modules offer it. Elsewhere it does
 * nothing and the status bar stays as it is.
 * @param hidden Whether the status bar is hidden.
 */
export const setStatusBarHidden = (hidden: boolean) => {
  if (!isAvailable()) {
    return;
  }

  StatusBar.setHidden({
    hidden,
    animation: 'fade',
  }).catch(() => undefined);
};
