import { useWidget } from '@shopgate/engage/page/hooks';
import { resolveBorderRadiusFromWidgetConfig } from '../../helpers';

/**
 * @typedef {Object} HeroBanner
 * @property {string} text Banner text content
 * @property {Object} backgroundImage Banner background image
 * @property {string} backgroundImage.url Banner background image URL
 * @property {string} backgroundImage.alt Banner background image alt text
 * @property {string} link Optional banner link
 * @property {"default"|"none"|"rounded"|"custom"} borderRadius The border radius option.
 * @property {number} [borderRadiusCustom] The custom border radius value.
 * @property {boolean} parallax Whether to apply a parallax effect to the image
 * @property {"fillAndCrop"|"showFull"} imageFit How the image should be displayed
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<HeroBanner> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the hero banner widget configuration and data.
 */
export const useHeroBannerWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();

  const {
    borderRadius,
    borderRadiusCustom,
    ...rest
  } = config || {};

  const borderRadiusResolved = resolveBorderRadiusFromWidgetConfig({
    borderRadius,
    borderRadiusCustom,
  });

  return {
    ...rest,
    borderRadius: borderRadiusResolved,
  };
};
