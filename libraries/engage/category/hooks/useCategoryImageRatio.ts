import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getCategoryImageRatio } from '@shopgate/engage/settings/selectors/appSettings';
import type { ImageResolution } from '@shopgate/engage/settings/types/appSettings';

export interface CategoryImageRatio {
  /** Width and height parts, a square for a missing or invalid setting. */
  ratio: number[];
  /** The resolution to request for the given image width. */
  resolutions: ImageResolution[];
  /** The ratio as CSS `aspect-ratio` value. */
  aspectRatio: string;
}

/**
 * Resolves the configured aspect ratio of category images.
 * @param imageWidth The width in pixels to request from the image service.
 * @returns The ratio, the resolutions to request and the CSS value.
 */
const useCategoryImageRatio = (imageWidth: number): CategoryImageRatio => {
  const { width, height } = useSelector(getCategoryImageRatio);
  const isValid = width > 0 && height > 0;
  const ratioWidth = isValid ? width : 1;
  const ratioHeight = isValid ? height : 1;

  return useMemo(() => ({
    ratio: [ratioWidth, ratioHeight],
    resolutions: [{
      width: imageWidth,
      height: Math.round((imageWidth * ratioHeight) / ratioWidth),
    }],
    aspectRatio: `${ratioWidth} / ${ratioHeight}`,
  }), [imageWidth, ratioHeight, ratioWidth]);
};

export default useCategoryImageRatio;
