import { useWidget } from '@shopgate/engage/page/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import { parseImageUrl } from '../../helpers';

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
    images,
    imageWrapping,
  } = config || {};

  const mappedImages = images.map(({ image, link }) => {
    const { url, altText } = image || {};

    return {
      xs: {
        url,
        altText,
        link,
      },
      md: {
        url: url ? parseImageUrl(url, true) : '',
        altText,
        link,
      },
    };
  });

  const responsiveValues = useResponsiveValue({
    xs: mappedImages.map(img => img.xs),
    md: mappedImages.map(img => img.md),
  });

  const responsiveImages = responsiveValues ?? [];

  return {
    images: responsiveImages,
    imageWrapping,
  };
};
