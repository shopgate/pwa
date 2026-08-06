import { useState, useEffect } from 'react';
import { loadImage } from '@shopgate/pwa-common/helpers/html/handleDOM';

/**
 * Load image hook
 * @param {string|null} src The image to preload. A falsy src is a no-op.
 * @returns {boolean} Whether the image has finished loading.
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
