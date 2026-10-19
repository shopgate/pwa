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
  /** Width of a thumbnail with the given height, at most three times as wide as high. */
  thumbnailWidth: number;
}

const MAX_THUMBNAIL_FACTOR = 3;

/**
 * Resolves the configured aspect ratio of category images.
 * @param imageWidth The width in pixels to request from the image service.
 * @param thumbnailHeight Height of a thumbnail whose width follows the ratio.
 * @returns The ratio, the resolutions to request, the CSS value and the thumbnail width.
 */
const useCategoryImageRatio = (
  imageWidth: number,
  thumbnailHeight = 0
): CategoryImageRatio => {
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
    thumbnailWidth: Math.min(
      Math.round((thumbnailHeight * ratioWidth) / ratioHeight),
      thumbnailHeight * MAX_THUMBNAIL_FACTOR
    ),
  }), [imageWidth, ratioHeight, ratioWidth, thumbnailHeight]);
};

export default useCategoryImageRatio;
