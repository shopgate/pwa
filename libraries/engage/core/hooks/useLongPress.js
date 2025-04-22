import { useRef, useCallback } from 'react';

/**
 * Prevents the default context menu from appearing on long press.
 * @param {Object} e The event object.
 * @returns {void}
 */
const preventContextMenu = e => e.preventDefault();

/**
 * Custom hook to handle long press interactions.
 *
 * @param {Function} callback - Function to call on long press.
 * @param {Object} [options={}] - Configuration and lifecycle callbacks.
 * @param {number} [options.threshold=1000] - Duration in milliseconds to trigger long press.
 * @param {Function} [options.onStart] - This function is called when the user starts pressing.
 * @param {Function} [options.onFinish] - This function is called when a long press event finishes
 * successfully (the user releases after the threshold).
 * @param {Function} [options.onCancel] - This function is called when a press event is cancelled
 * (the user releases before the threshold).
 *
 * @returns {Object} Event handlers to attach to an element.
 * @returns {Function} return.onMouseDown
 * @returns {Function} return.onTouchStart
 * @returns {Function} return.onMouseUp
 * @returns {Function} return.onMouseLeave
 * @returns {Function} return.onTouchEnd
 * @returns {Function} return.onContextMenu
 *
 * @example
 * const bind = useLongPress(
 *   () => console.log('Long Pressed!'),
 *   {
 *     threshold: 2000,
 *     onStart: () => console.log('Start'),
 *     onFinish: () => console.log('Finish'),
 *     onCancel: () => console.log('Cancel'),
 *   }
 * );
 * <div {...bind}>Press and Hold</div>
 */
function useLongPress(
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

export default useLongPress;
