import { useState, useEffect } from 'react';
import { loadImage } from '@shopgate/pwa-common/helpers/html/handleDOM';

/**
 * Load image hook
 * @param {string} src .
 * @returns {boolean}
 */
export function useLoadImage(src) {
  const [loaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (src && !loaded) {
      loadImage(src).then(() => setIsLoaded(true));
    }
  }, [loaded, src]);
  return loaded;
}
