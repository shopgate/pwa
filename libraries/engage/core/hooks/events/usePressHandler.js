import { useCallback } from 'react';

/**
 * @typedef {Object} PressHandlers
 * @property {Function} onClick - Click event handler.
 * @property {Function} onKeyDown - Keydown handler for Enter/Space.
 */

/**
 * Improves development for accessibility by simplifying registration of multiple
 * listeners (click, Enter, Space) to invoke the a callback when an element is
 * interacted with.
 *
 * @param {Function} onPress Callback to run when the element is interacted with
 * @param {Object} [options] Optional configuration
 * @param {boolean} [options.triggerOnSpace=true] Whether Space triggers onActivate
 * @param {boolean} [options.triggerOnEnter=false] Whether Enter triggers onActivate
 * @returns {PressHandlers} handlers - Event handlers to spread onto an element
 *
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
function usePressHandler(onPress, options = {}) {
  const {
    triggerOnSpace = true,
    triggerOnEnter = false,
  } = options;

  const handleKeyDown = useCallback(
    (e) => {
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
    (e) => {
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
