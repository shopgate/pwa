import { useWidget } from '@shopgate/engage/page/hooks';
import { useMemo } from 'react';
import { resolveBorderRadiusFromWidgetConfig } from '../../helpers';

/**
 * @typedef {Object} ImageRowWidgetConfig
 * @property {Array} images The images array.
 * @property {string} imageWrapping The imageWrapping setting,
 * one of: responsiveDefault | responsiveDense | responsiveNoWrap.
 * @property {string} [link] The optional link URL.
 * @property {number} [imageSpacing] An optional gap between images (in pixels).
 * @property {"default"|"none"|"rounded"|"custom"} borderRadius The border radius option.
 * @property {number} [borderRadiusCustom] The custom border radius value.
 * @property {boolean} [parallax] Whether to apply a parallax effect to the image.
 * @property {number} [slidesPerViewCustomLarge] Number of slides to show on large screens
 * (only for 'responsiveCustom' wrapping).
 * @property {number} [slidesPerViewCustomMedium] Number of slides to show on medium screens
 * (only for 'responsiveCustom' wrapping).
 * @property {number} [slidesPerViewCustomSmall] Number of slides to show on small screens
 * (only for 'responsiveCustom' wrapping).
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<ImageRowWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Image row widget configuration and data.
 * Handles responsive image URLs and alt texts.
 */
export const useImageRowWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const {
    images = [],
    imageWrapping,
    imageSpacing = 0,
    borderRadius,
    borderRadiusCustom,
    parallax,
    slidesPerViewCustomLarge,
    slidesPerViewCustomMedium,
    slidesPerViewCustomSmall,
  } = config || {};

  const borderRadiusResolved = resolveBorderRadiusFromWidgetConfig({
    borderRadius,
    borderRadiusCustom,
  });

  const mappedImages = useMemo(() => images.map(({ image, link }) => {
    const { url, altText } = image || {};

    return {
      url,
      altText,
      link,
    };
  }).filter(img => img.url), [images]);

  return {
    images: mappedImages,
    imageWrapping,
    imageSpacing,
    borderRadius: borderRadiusResolved,
    parallax,
    slidesPerViewCustomLarge,
    slidesPerViewCustomMedium,
    slidesPerViewCustomSmall,
  };
};
