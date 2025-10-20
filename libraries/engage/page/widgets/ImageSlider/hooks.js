import { useMemo } from 'react';
import { useWidget } from '@shopgate/engage/page/hooks';
import { useTheme } from '@shopgate/engage/styles';
import { resolveBorderRadiusFromWidgetConfig } from '../../helpers';

/**
 * @typedef {import('swiper/react').SwiperProps} SwiperCmpProps
 */

/**
 * @typedef {Object} ImageSliderImageData
 * @property {string} url The image URL.
 * @property {string} [altText] The image alt text.
 */

/**
 * @typedef {Object} ImageSliderImage
 * @property {ImageSliderImageData} image The image data object.
 * @property {string} [link] The link URL.
 */

/**
 * @typedef {Object} ImageSliderWidgetConfig
 * @property {ImageSliderImage[]} images The image objects.
 * @property {boolean} slideAutomatic Whether the slider should automatically slide.
 * @property {boolean} endlessSlider Whether the slider should loop endlessly.
 * @property {number} sliderSpeed The speed (in ms) for the slider autoplay.
 * @property {"default"|"dense"|"custom"} slidesPerView
 * @property {number} slidesPerViewCustomSmall Slides per view for small screens.
 * @property {number} slidesPerViewCustomMedium Slides per view for medium screens.
 * @property {number} slidesPerViewCustomLarge Slides per view for large screens.
 * @property {number} imageSpacing Optional gap between image slides (in pixels).
 * @property {"default"|"off"|"bullets"|"progressbar"|"fraction"} paginationStyle
 * @property {"default"|"none"|"rounded"|"custom"} borderRadius The border radius option.
 * @property {number} [borderRadiusCustom] The custom border radius value.
 * the pagination type for the slider.
 */

/**
 * @typedef {ReturnType<typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<ImageSliderWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the ImageSlider widget configuration and data.
 */
export const useImageSliderWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config, isPreview, layout } = useWidget();
  const theme = useTheme();

  const {
    images,
    slideAutomatic,
    endlessSlider,
    sliderSpeed,
    slidesPerView,
    slidesPerViewCustomSmall,
    slidesPerViewCustomMedium,
    slidesPerViewCustomLarge,
    imageSpacing,
    paginationStyle = 'bullets',
    borderRadius,
    borderRadiusCustom,
  } = config;

  const borderRadiusResolved = resolveBorderRadiusFromWidgetConfig({
    borderRadius,
    borderRadiusCustom,
  });

  const paginationType = useMemo(() => (paginationStyle === 'default' ? 'bullets' : paginationStyle.toLowerCase()),
    [paginationStyle]);
  const imagesWithUrls = useMemo(() => images.filter(img => img?.image?.url), [images]);

  /**
   * @type {SwiperCmpProps}
   */
  const swiperProps = useMemo(() => {
    let slidesPerViewSmall = 1.0;
    let slidesPerViewMedium = 1.3;
    let slidesPerViewLarge = 1.6;

    if (slidesPerView === 'dense') {
      slidesPerViewSmall = 1.3;
      slidesPerViewMedium = 1.8;
      slidesPerViewLarge = 2.3;
    } else if (slidesPerView === 'custom') {
      slidesPerViewSmall = slidesPerViewCustomSmall;
      slidesPerViewMedium = slidesPerViewCustomMedium;
      slidesPerViewLarge = slidesPerViewCustomLarge;
    }

    const breakpoints = {
      [theme.breakpoints.values.sm]: {
        slidesPerView: slidesPerViewMedium,
      },
      [theme.breakpoints.values.md]: {
        slidesPerView: slidesPerViewLarge,
      },
    };

    const showPagination = paginationType !== 'off' && imagesWithUrls.length > 1;
    // Create a key that changes when relevant config changes, to force remount of Swiper
    const componentKey = isPreview ? JSON.stringify({
      slidesPerView,
      spaceBetween: imageSpacing,
      paginationType,
      showPagination,
      ...breakpoints,
    }) : null;

    return {
      autoplay: slideAutomatic ? { delay: sliderSpeed } : false,
      loop: endlessSlider,
      slidesPerView: slidesPerViewSmall,
      breakpoints,
      spaceBetween: imageSpacing,
      pagination: showPagination ? {
        type: paginationType,
        clickable: true,
        dynamicBullets: true,
      } : false,
      // Prevent cut-off sliders when margins are used in the layout
      ...(layout.marginLeft || layout.marginRight ? {
        style: {
          ...layout.marginLeft ? {
            marginLeft: layout.marginLeft * -1,
            paddingLeft: layout.marginLeft,
          } : {},
          ...layout.marginRight ? {
            marginRight: layout.marginRight * -1,
            paddingRight: layout.marginRight,
          } : {},
        },
      } : null),
      ...isPreview ? {
        key: componentKey,
        // Improves interaction with the slider in the CMS preview iframe
        touchStartPreventDefault: true,
      } : {},
    };
  },
  [
    slidesPerView,
    theme.breakpoints.values.sm,
    theme.breakpoints.values.md,
    paginationType,
    imagesWithUrls.length,
    imageSpacing,
    slideAutomatic,
    sliderSpeed,
    endlessSlider,
    isPreview,
    slidesPerViewCustomSmall,
    slidesPerViewCustomMedium,
    slidesPerViewCustomLarge,
    layout,
  ]);

  return {
    slides: imagesWithUrls,
    swiperProps,
    borderRadius: borderRadiusResolved,
  };
};
