import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Swiper, Link, ConditionalWrapper } from '@shopgate/engage/components';
import { ResponsiveWidgetImage } from '@shopgate/engage/page/components';
import { useImageSliderWidget } from './hooks';

const useStyles = makeStyles()({
  image: {
    width: '100%',
    minHeight: 1,
  },
});

/**
 * The ImageSliderWidget is used to display an image slider.
 * @returns {JSX.Element}
 */
const ImageSliderWidget = () => {
  const { slides, swiperProps, borderRadius } = useImageSliderWidget();
  const { classes } = useStyles();

  if (slides.length === 0) {
    return null;
  }

  return (
    <Swiper
      indicators
      {...swiperProps}
    >
      {slides.map((slide) => {
        if (!slide.image.url) {
          return null;
        }

        return (
          <Swiper.Item key={slide.image.url}>
            <ConditionalWrapper
              condition={!!slide.link}
              wrapper={children => (
                <Link href={slide.link}>
                  {children}
                </Link>
              )}
            >
              <ResponsiveWidgetImage
                className={classes.image}
                src={slide.image.url}
                alt={slide.image.altText || ''}
                borderRadius={borderRadius}
              />
            </ConditionalWrapper>
          </Swiper.Item>
        );
      })}
    </Swiper>
  );
};

export default ImageSliderWidget;
