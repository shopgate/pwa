import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

export interface LongPressHandlers {
  /**
   * Attach to `onMouseDown` event.
   */
  onMouseDown: (e: ReactMouseEvent | TouchEvent) => void;

  /**
   * Attach to `onTouchStart` event.
   */
  onTouchStart: (e: ReactTouchEvent | TouchEvent) => void;

  /**
   * Attach to `onMouseUp` event.
   */
  onMouseUp: (e: ReactMouseEvent | TouchEvent) => void;

  /**
   * Attach to `onMouseLeave` event.
   */
  onMouseLeave: (e: ReactMouseEvent | TouchEvent) => void;

  /**
   * Attach to `onTouchEnd` event.
   */
  onTouchEnd: (e: ReactTouchEvent | TouchEvent) => void;

  /**
   * Attach to `onContextMenu` event to prevent the native context menu.
   */
  onContextMenu: (e: MouseEvent) => void;
}

export interface UseLongPressOptions {
  /**
   * Duration in milliseconds to trigger long press.
   * @default 1000
   */
  threshold?: number;

  /**
   * Called when the press starts.
   */
  onStart?: (e: ReactMouseEvent | ReactTouchEvent) => void;

  /**
   * Called when the long press completes.
   */
  onFinish?: (e: ReactMouseEvent | ReactTouchEvent) => void;

  /**
   * Called when the press is cancelled before the threshold.
   */
  onCancel?: (e: ReactMouseEvent | ReactTouchEvent) => void;
}

/**
 * Custom hook to handle long press interactions.
 *
 * @param callback Function to call on long press.
 * @param options Configuration and lifecycle callbacks.
 * @returns An object containing event handlers for mouse and touch events.
 */
export default function useLongPress(
  callback: (e: ReactMouseEvent | ReactTouchEvent) => void,
  options?: UseLongPressOptions
): LongPressHandlers;
