import { useMemo } from 'react';
import { useWidget } from '@shopgate/engage/page/hooks';
import { useTheme } from '@shopgate/engage/styles';

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
 * @typedef {Object} ImageWidgetConfig
 * @property {ImageSliderImage[]} images The image objects.
 * @property {boolean} slideAutomatic Whether the slider should automatically slide.
 * @property {boolean} endlessSlider Whether the slider should loop endlessly.
 * @property {number} sliderSpeed The speed (in ms) for the slider autoplay.
 * @property {"default"|"dense"|"custom"} slidesPerView
 * @property {number} slidesPerViewCustomSmall Slides per view for small screens.
 * @property {number} slidesPerViewCustomMedium Slides per view for medium screens.
 * @property {number} slidesPerViewCustomLarge Slides per view for large screens.
 * @property {number} imageSpacing Optional gap between image slides (in pixels).
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<ImageWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the ImageSlider widget configuration and data.
 */
export const useImageSliderWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config, isPreview } = useWidget();
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
  } = config;

  const paginationType = useMemo(() => (paginationStyle === 'default' ? 'bullets' : paginationStyle.toLowerCase()),
    [paginationStyle]);

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

    return {
      autoplay: slideAutomatic ? { delay: sliderSpeed } : false,
      loop: endlessSlider,
      slidesPerView: slidesPerViewSmall,
      breakpoints,
      spaceBetween: imageSpacing,
      paginationType,
      ...isPreview ? {
        // Improves interaction with the slider in the CMS preview iframe
        touchStartPreventDefault: true,
        // Create a component key from breakpoint settings to force remount on breakpoint change.
        // This fixes issues with the Swiper when breakpoint settings change during runtime.
        key: JSON.stringify({
          slidesPerView,
          spaceBetween: imageSpacing,
          paginationType,
          ...breakpoints,
        }),
      } : {},
    };
  },
  [slidesPerView, theme.breakpoints.values.sm, theme.breakpoints.values.md,
    slideAutomatic, sliderSpeed, endlessSlider, imageSpacing, paginationType,
    isPreview, slidesPerViewCustomSmall, slidesPerViewCustomMedium,
    slidesPerViewCustomLarge]);

  return {
    slides: images.filter(img => img?.image?.url),
    swiperProps,
  };
};
