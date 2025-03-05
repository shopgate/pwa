import { useEffect, useState } from 'react';

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
