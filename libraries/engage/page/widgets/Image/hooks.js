import { useWidget } from '@shopgate/engage/page/hooks';
import { useResponsiveValue } from '@shopgate/engage/styles';

/**
 * Parses the image URL to return a high resolution version if required.
 * @param {string} url The original image URL.
 * @param {boolean} useHighRes Whether to return a high resolution version.
 * @returns {string} The parsed image URL.
 */
const parseImageUrl = (url, useHighRes) => {
  if (!url || !useHighRes) {
    return url;
  }

  const match = url.match(/^(.*)\.([^./]+)$/);

  return !match ? url : `${match[1]}@2x.${match[2]}`;
};

/**
 * @typedef {Object} ImageWidgetConfig
 * @property {Object} image The image object.
 * @property {string} image.url The image URL.
 * @property {string} [image.altText] The image alt text.
 * @property {Object} image_wide The wide image object.
 * @property {string} image_wide.url The wide image URL.
 * @property {string} [image_wide.altText] The wide image alt text.
 * @property {boolean} [use_image_wide] Whether to use the wide image on
 * medium and larger screens.
 * @property {string} [link] The link URL.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<ImageWidgetConfig> >} UseWidgetReturnType
 */

/**
 * Hook to access the Image widget configuration and data.
 * Handles responsive image URLs and alt texts.
 * @returns {Object} The image widget data.
 * @property {string} url The image URL, adjusted for screen size.
 * @property {string} altText The image alt text, adjusted for screen size.
 * @property {string} [link] The link URL.
 */
export const useImageWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();
  const {
    image, image_wide: imageWide, link, use_image_wide: useImageWide,
  } = config || {};

  const url = useResponsiveValue({
    xs: image?.url,
    md: useImageWide && imageWide?.url ?
      parseImageUrl(imageWide.url, true) :
      parseImageUrl(image?.url, true),
  });

  const altText = useResponsiveValue({
    xs: image?.altText,
    md: useImageWide && imageWide?.altText ? imageWide.altText : image?.altText,
  });

  return {
    url,
    altText,
    link,
  };
};
