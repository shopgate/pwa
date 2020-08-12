import { useState, useRef, useEffect } from 'react';

/**
 * Hook to use getBoundingClientRect
 * @returns {Array}
 */
export const useBoundingRect = () => {
  const ref = useRef();
  const [bbox, setBbox] = useState({});

  // eslint-disable-next-line require-jsdoc
  const set = () => setBbox(ref && ref.current ? ref.current.getBoundingClientRect() : {});

  useEffect(() => {
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  return [bbox, ref];
};
