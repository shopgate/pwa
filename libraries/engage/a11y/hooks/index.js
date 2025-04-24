import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { increaseModalCount, decreaseModalCount } from '../action-creators';

/**
 * The useReduceMotion hook
 * to determine whether the user selected reduced motion in the phone settings
 * @returns {boolean} whether the user prefers reduced motions in the settings
 */
export const useReduceMotion = () => {
  const [matches, setMatch] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    // eslint-disable-next-line require-jsdoc
    const handleChange = () => {
      setMatch(mq.matches);
    };
    handleChange();
    mq.addEventListener('change', handleChange);
    return () => {
      mq.removeEventListener('change', handleChange);
    };
  }, []);
  return matches;
};

/**
 * Tracks when a modal-like component is considered "visible", and dispatches Redux
 * actions accordingly. This is useful for global tracking of visible overlays,
 * modals, drawers, or any component with a similar behavior.
 *
 * Dispatches `increaseModalCount()` when the component becomes visible
 * Dispatches `decreaseModalCount()` when the component becomes hidden
 * Dispatches `decreaseModalCount()` on unmount if the component was still visible
 *
 * Call this hook inside any modal like component that:
 *   - Mounts/unmounts based on visibility (like a modal or tooltip)
 *   - OR uses a visibility prop (e.g. `isVisible`)
 *
 * @param {boolean} isVisible Optional visibility flag.
 * If omitted, visibility is assumed `true` while mounted.
 *
 * @example
 * // Component that uses isVisible prop
 * function MyModal({ isVisible }) {
 *   useTrackModalState(isVisible);
 *   return <div className="my_modal">...</div>;
 * }
 *
 * @example
 * // Component that appears/disappears via mounting
 * function MyModal() {
 *   useTrackModalState(); // defaults to `true`
 *   return <div className="tooltip">Hello!</div>;
 * }
 */
export function useTrackModalState(isVisible = true) {
  const dispatch = useDispatch();
  const wasVisible = useRef(false);

  // React to changes in visibility
  useEffect(() => {
    if (isVisible && !wasVisible.current) {
      dispatch(increaseModalCount());
      wasVisible.current = true;
    } else if (!isVisible && wasVisible.current) {
      dispatch(decreaseModalCount());
      wasVisible.current = false;
    }
  }, [isVisible, dispatch]);

  // On unmount, dispatch hide if it was still visible
  useEffect(() => () => {
    if (wasVisible.current) {
      dispatch(decreaseModalCount());
      wasVisible.current = false;
    }
  }, [dispatch]);
}
