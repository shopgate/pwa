import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} HeroBanner
 * @property {string} text Banner text content
 * @property {Object} backgroundImage Banner background image
 * @property {string} backgroundImage.url Banner background image URL
 * @property {string} backgroundImage.alt Banner background image alt text
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
  return {
    text: config?.text || config?.Text || '',
    backgroundImage: config?.backgroundImage,
  };
};
