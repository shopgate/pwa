import { useRef, useCallback } from 'react';

/**
 * @typedef {Object} LongPressHandlers
 * @property {Function} onMouseDown - Attach to `onMouseDown` event.
 * @property {Function} onTouchStart - Attach to `onTouchStart` event.
 * @property {Function} onMouseUp - Attach to `onMouseUp` event.
 * @property {Function} onMouseLeave - Attach to `onMouseLeave` event.
 * @property {Function} onTouchEnd - Attach to `onTouchEnd` event.
 * @property {Function} onContextMenu - Attach to `onContextMenu` event to prevent the native
 * context menu.
 */

/**
 * Prevents the default context menu from appearing on long press.
 * @param {MouseEvent} e The event object.
 */
const preventContextMenu = (e) => {
  e.preventDefault();
};

/**
 * Custom hook to handle long press interactions.
 *
 * @param {Function} callback - Function to call on long press.
 * @param {Object} [options={}] - Configuration and lifecycle callbacks.
 * @param {number} [options.threshold=1000] - Duration in milliseconds to trigger long press.
 * @param {Function} [options.onStart] - Called when the press starts.
 * @param {Function} [options.onFinish] - Called when the long press completes.
 * @param {Function} [options.onCancel] - Called when the press is cancelled before the threshold.
 *
 * @returns {LongPressHandlers} An object containing event handlers for mouse and touch events.
 */
export default function useLongPress(
  callback,
  {
    threshold = 1000,
    onStart,
    onFinish,
    onCancel,
  } = {}
) {
  const timerRef = useRef(null);
  const triggeredRef = useRef(false);

  const start = useCallback(
    (e) => {
      if (onStart) onStart(e);
      triggeredRef.current = false;

      timerRef.current = setTimeout(() => {
        callback(e);
        triggeredRef.current = true;
        if (onFinish) onFinish(e);
      }, threshold);
    },
    [onStart, threshold, callback, onFinish]
  );

  const cancel = useCallback(
    (e) => {
      clearTimeout(timerRef.current);
      if (!triggeredRef.current && onCancel) {
        onCancel(e);
      }
    },
    [onCancel]
  );

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchEnd: cancel,
    // prevents right-click or long-press menu
    onContextMenu: preventContextMenu,
  };
}
