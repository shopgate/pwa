import { useWidget } from '@shopgate/engage/page/hooks';
import { resolveBorderRadiusFromWidgetConfig } from '../../helpers';

/**
 * @typedef {Object} HeroBanner
 * @property {string} text Banner text content
 * @property {string} link Optional banner link
 * @property {"default"|"none"|"rounded"|"custom"} borderRadius The border radius option.
 * @property {number} [borderRadiusCustom] The custom border radius value.
 * @property {boolean} parallax Whether to apply a parallax effect to the image
 * @property {Object} backgroundImage Banner background image
 * @property {string} backgroundImage.url Banner background image URL
 * @property {string} backgroundImage.alt Banner background image alt text
 * @property {"fillAndCrop"|"showFull"} imageFit How the image should be displayed
 * @property {"image"|"video"} mediaType The type of media to display
 * @property {string} url The URL of the media to display
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<HeroBanner> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Image widget configuration and data.
 */
export const useHeroBannerWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const {
    borderRadius,
    borderRadiusCustom,
    mediaType = 'image',
    backgroundImage,
    url,
    ...rest
  } = config || {};
  let mediaUrl;

  if (mediaType === 'video') {
    mediaUrl = url;
  } else if (mediaType === 'image') {
    mediaUrl = backgroundImage?.url;
  }

  const borderRadiusResolved = resolveBorderRadiusFromWidgetConfig({
    borderRadius,
    borderRadiusCustom,
  });

  return {
    ...rest,
    mediaType,
    mediaUrl,
    altText: backgroundImage?.alt || '',
    borderRadius: borderRadiusResolved,
  };
};
