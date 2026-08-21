import { useCallback } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';

/**
 * The events that can activate a pressable element.
 */
export type PressEvent = ReactMouseEvent | ReactKeyboardEvent;

/**
 * Event handlers to spread onto the element that should react to a press.
 */
export interface PressHandlers {
  /**
   * Click event handler.
   */
  onClick: (e: ReactMouseEvent) => void;
  /**
   * Keydown handler for Enter/Space.
   */
  onKeyDown: (e: ReactKeyboardEvent) => void;
}

/**
 * Optional configuration for the press handlers.
 */
export interface UsePressHandlerOptions {
  /**
   * Whether Space triggers the callback.
   * @default true
   */
  triggerOnSpace?: boolean;
  /**
   * Whether Enter triggers the callback.
   * @default false
   */
  triggerOnEnter?: boolean;
}

/**
 * Improves development for accessibility by simplifying registration of multiple
 * listeners (click, Enter, Space) to invoke the a callback when an element is
 * interacted with.
 * @param onPress Callback to run when the element is interacted with.
 * @param options Optional configuration.
 * @returns Event handlers to spread onto an element.
 * @example
 * ```js
 * function MyPressableButton({ onActivate }) {
 *   // Only Enter will trigger activation; Space is disabled
 *   const handlers = usePressHandler(onActivate, {
 *     triggerOnEnter: true,
 *     triggerOnSpace: false,
 *   })
 * //
 *   return (
 *     <div
 *       {...handlers}
 *       role="button"
 *       tabIndex={0}
 *     >
 *       Press Me (Enter only)
 *     </div>
 *   )
 * }
 * ```
 */
function usePressHandler(
  onPress: (e: PressEvent) => void,
  options: UsePressHandlerOptions = {}
): PressHandlers {
  const {
    triggerOnSpace = true,
    triggerOnEnter = false,
  } = options;

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      // Check for Enter
      if (triggerOnEnter && e.key === 'Enter') {
        e.preventDefault();
        onPress(e);
      }
      // Check for Space (may be ' ' or 'Spacebar')
      if (
        triggerOnSpace &&
        (e.key === ' ' || e.key === 'Spacebar')
      ) {
        e.preventDefault();
        onPress(e);
      }
    },
    [onPress, triggerOnEnter, triggerOnSpace]
  );

  const handleClick = useCallback(
    (e: ReactMouseEvent) => {
      onPress(e);
    },
    [onPress]
  );

  return {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };
}

export default usePressHandler;
