// @ts-check
import { useRef, useCallback } from 'react';

/** @typedef {import('./useLongPress').LongPressHandlers} LongPressHandlers */
/** @typedef {import('./useLongPress').UseLongPressOptions} UseLongPressOptions */

/**
 * Prevents the default context menu from appearing on long press.
 * @param {MouseEvent} e The event object.
 */
const preventContextMenu = (e) => {
  e.preventDefault();
};

// eslint-disable-next-line valid-jsdoc
/**
 * Custom hook to handle long press interactions.
 *
 * @param {(e: Event) => void} callback - Function to call on long press.
 * @param {UseLongPressOptions} [options={}] - Configuration and lifecycle callbacks.
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
