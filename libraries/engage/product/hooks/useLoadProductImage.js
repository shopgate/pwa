import { useState, useEffect } from 'react';
import { loadProductImage } from '../helpers/index';

/**
 * Load product image hook
 * @param {string} src .
 * @param {Object} resolution .
 * @returns {boolean}
 */
export function useLoadProductImage(src, resolution = null) {
  const [loadedImage, setLoadedImage] = useState(null);

  useEffect(() => {
    if (src) {
      setLoadedImage(null);
    }
  }, [src]);

  useEffect(() => {
    if (src && !loadedImage) {
      loadProductImage(src, resolution).then(imageSrc => setLoadedImage(imageSrc));
    }
  }, [loadedImage, resolution, src]);

  return loadedImage;
}
