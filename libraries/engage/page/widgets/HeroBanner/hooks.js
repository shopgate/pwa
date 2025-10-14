import { useWidget } from '@shopgate/engage/page/hooks';
import { resolveBorderRadius } from '../../components/Widgets/helpers';

/**
 * @typedef {Object} HeroBanner
 * @property {string} text Banner text content
 * @property {Object} backgroundImage Banner background image
 * @property {string} backgroundImage.url Banner background image URL
 * @property {string} backgroundImage.alt Banner background image alt text
 * @property {string} link Optional banner link
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
  } = config || {};

  const borderRadiusResolved = resolveBorderRadius(
    {
      borderRadius,
      borderRadiusCustom,
    }
  );

  return { ...config, borderRadius: borderRadiusResolved };
};
