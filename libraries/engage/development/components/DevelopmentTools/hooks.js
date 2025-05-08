import { useEffect, useCallback } from 'react';

/**
 * Hook to handle a single keyboard shortcut.
 * Supports both 'cmd' (meta) and 'ctrl' keys explicitly.
 *
 * @param {string} shortcut - Shortcut string using mac-style notation, e.g. 'cmd+i'.
 * @param {Function} callback - Function to call when the shortcut is triggered.
 */
export function useShortcut(shortcut, callback) {
  const normalizeShortcut = useCallback(() => shortcut
    .toLowerCase()
    .split('+')
    .map(k => k.trim())
    .sort()
    .join('+'), [shortcut]);

  const handleKeyDown = useCallback(
    (event) => {
      const keys = [];

      if (event.ctrlKey) keys.push('ctrl');
      if (event.metaKey) keys.push('cmd'); // Treat meta as cmd
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
