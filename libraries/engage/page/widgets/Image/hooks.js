import { useWidget } from '@shopgate/engage/page/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';
import { resolveBorderRadius } from '../../components/Widgets/helpers';

/**
 * @typedef {Object} ImageWidgetConfig
 * @property {Object} image The image object.
 * @property {string} image.url The image URL.
 * @property {string} [image.altText] The image alt text.
 * @property {Object} imageWide The wide image object.
 * @property {string} imageWide.url The wide image URL.
 * @property {string} [imageWide.altText] The wide image alt text.
 * @property {boolean} [useImageWide] Whether to use the wide image on
 * medium and larger screens.
 * @property {string} [link] The link URL.
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
    image, imageWide, link, useImageWide, borderRadius, borderRadiusCustom,
  } = config || {};

  const borderRadiusResolved = resolveBorderRadius(
    {
      borderRadius,
      borderRadiusCustom,
    }
  );

  const resolved = useResponsiveValue({
    xs: {
      url: image?.url,
      altText: image?.altText,
    },
    md: {
      url: useImageWide && imageWide?.url ? imageWide.url : image?.url,
      altText: useImageWide && imageWide?.altText ? imageWide.altText : image?.altText,
    },
  });

  return {
    url: resolved.url,
    altText: resolved.altText,
    link,
    borderRadius: borderRadiusResolved,
  };
};
