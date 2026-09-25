import { useRef, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

/**
 * The events a long press interaction can originate from. The handlers below are spread onto an
 * element, so these are React's synthetic events rather than the DOM ones.
 */
export type LongPressEvent = ReactMouseEvent | ReactTouchEvent;

/**
 * Event handlers to spread onto the element that should react to a long press.
 */
export interface LongPressHandlers {
  /**
   * Attach to `onMouseDown` event.
   */
  onMouseDown: (e: LongPressEvent) => void;

  /**
   * Attach to `onTouchStart` event.
   */
  onTouchStart: (e: LongPressEvent) => void;

  /**
   * Attach to `onMouseUp` event.
   */
  onMouseUp: (e: LongPressEvent) => void;

  /**
   * Attach to `onMouseLeave` event.
   */
  onMouseLeave: (e: LongPressEvent) => void;

  /**
   * Attach to `onTouchEnd` event.
   */
  onTouchEnd: (e: LongPressEvent) => void;

  /**
   * Attach to `onContextMenu` event to prevent the native context menu.
   */
  onContextMenu: (e: ReactMouseEvent) => void;
}

/**
 * Configuration and lifecycle callbacks for a long press interaction.
 */
export interface UseLongPressOptions {
  /**
   * Duration in milliseconds to trigger long press.
   * @default 1000
   */
  threshold?: number;

  /**
   * Called when the press starts.
   */
  onStart?: (e: LongPressEvent) => void;

  /**
   * Called when the long press completes.
   */
  onFinish?: (e: LongPressEvent) => void;

  /**
   * Called when the press is cancelled before the threshold.
   */
  onCancel?: (e: LongPressEvent) => void;
}

/**
 * Prevents the default context menu from appearing on long press.
 * @param e The event object.
 */
const preventContextMenu = (e: ReactMouseEvent) => {
  e.preventDefault();
};

/**
 * Custom hook to handle long press interactions.
 * @param callback Function to call on long press.
 * @param options Configuration and lifecycle callbacks.
 * @returns An object containing event handlers for mouse and touch events.
 */
export default function useLongPress(
  callback: (e: LongPressEvent) => void,
  options: UseLongPressOptions = {}
): LongPressHandlers {
  const {
    threshold = 1000,
    onStart,
    onFinish,
    onCancel,
  } = options;

  const timerRef = useRef<number | undefined>(undefined);
  const triggeredRef = useRef(false);

  const start = useCallback(
    (e: LongPressEvent) => {
      if (onStart) onStart(e);
      triggeredRef.current = false;

      timerRef.current = window.setTimeout(() => {
        callback(e);
        triggeredRef.current = true;
        if (onFinish) onFinish(e);
      }, threshold);
    },
    [onStart, threshold, callback, onFinish]
  );

  const cancel = useCallback(
    (e: LongPressEvent) => {
      window.clearTimeout(timerRef.current);
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
