import { useWidget } from '@shopgate/engage/page/hooks';
import { useMemo } from 'react';

/**
 * @typedef {Object} ImageWidgetConfig
 * @property {Array} images The images array.
 * @property {string} imageWrapping The imageWrapping setting,
 * one of: responsiveDefault | responsiveDense | responsiveNoWrap.
 * @property {string} [link] The optional link URL.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<ImageWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Image widget configuration and data.
 * Handles responsive image URLs and alt texts.
 */
export const useImageWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const {
    images = [],
    imageWrapping,
  } = config || {};

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
  };
};
