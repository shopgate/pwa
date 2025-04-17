import { useEffect, useCallback } from 'react';

/**
 * Determines if the current platform is macOS.
 * @returns {boolean} True if the platform is macOS, false otherwise.
 */
function isMacOS() {
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

/**
 * Hook to handle a single keyboard shortcut.
 * Automatically maps 'cmd' to 'meta' on macOS and 'ctrl' on Windows/Linux.
 *
 * @param {string} shortcut - Shortcut string using mac-style notation, e.g. 'cmd+i'.
 * @param {Function} callback - Function to call when the shortcut is triggered.
 */
export function useShortcut(shortcut, callback) {
  const normalizeShortcut = useCallback(() => shortcut
    .toLowerCase()
    .replace('cmd', isMacOS() ? 'meta' : 'ctrl')
    .split('+')
    .sort()
    .join('+'), [shortcut]);

  const handleKeyDown = useCallback(
    /**
     * Handles keydown events for the specified shortcut.
     * @param {KeyboardEvent} event The keyboard event.
     */
    (event) => {
      const keys = [];

      if (event.ctrlKey) keys.push('ctrl');
      if (event.metaKey) keys.push('meta');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');

      const key = event.key.toLowerCase();
      if (!['control', 'meta', 'alt', 'shift'].includes(key)) {
        keys.push(key);
      }

      const pressed = keys.sort().join('+');

      if (pressed === normalizeShortcut()) {
        event.preventDefault();
        callback(event);
      }
    },
    [callback, normalizeShortcut]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
