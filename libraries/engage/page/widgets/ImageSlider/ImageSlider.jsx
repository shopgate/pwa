import React from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import { Swiper, Link, ConditionalWrapper } from '@shopgate/engage/components';
import { useImageSliderWidget } from './hooks';

const useStyles = makeStyles()({
  image: {
    touchAction: 'none',
    width: '100%',
  },
});

/**
 * The ImageSliderWidget is used to display an image slider.
 * @returns {JSX.Element}
 */
const ImageSliderWidget = () => {
  const { classes } = useStyles();
  const { slides, swiperProps } = useImageSliderWidget();

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
              <img
                className={classes.image}
                loading="lazy"
                src={slide.image.url}
                alt={slide.image.altText || ''}
              />
            </ConditionalWrapper>
          </Swiper.Item>
        );
      })}
    </Swiper>
  );
};

export default ImageSliderWidget;
