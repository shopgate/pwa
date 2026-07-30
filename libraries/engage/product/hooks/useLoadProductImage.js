import { useState, useEffect } from 'react';
import { useImageServiceSettings } from '@shopgate/engage/settings/hooks';
import { loadProductImage } from '../helpers/index';

/**
 * Load product image hook
 * @param {string} src .
 * @param {Object} resolution .
 * @returns {boolean}
 */
export function useLoadProductImage(src, resolution = null) {
  const [loadedImage, setLoadedImage] = useState(null);
  const imageServiceSettings = useImageServiceSettings();

  useEffect(() => {
    if (src) {
      setLoadedImage(null);
    }
  }, [src]);

  useEffect(() => {
    if (src && !loadedImage) {
      loadProductImage(src, resolution, imageServiceSettings)
        .then(imageSrc => setLoadedImage(imageSrc));
    }
  }, [imageServiceSettings, loadedImage, resolution, src]);

  return loadedImage;
}
