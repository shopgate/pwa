import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { getProductImageSettings } from '@shopgate/engage/product/helpers';
import { Swiper, Image } from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { GALLERY_SLIDER_ZOOM } from '../../../../constants';
import connect from './connector';

const { colors } = themeConfig;
const { pdpImageSliderPaginationType } = appConfig || {};

const fullSize = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const useStyles = makeStyles()({
  container: {
    ...fullSize,
    background: colors.dark,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  slider: {
    height: '100%',
    '--swiper-pagination-fraction-top-offset': 'calc(4px + var(--safe-area-inset-top))',
    '--swiper-pagination-bottom': 'max(var(--safe-area-inset-bottom), 8px)',
  },
  slide: {
    position: 'relative',
    width: '100%',
  },
  swiperContainer: {
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    bottom: [
      '2px',
      'calc(2px + var(--safe-area-inset-bottom))',
    ],
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
});

/**
 * The Product media gallery component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGalleryMedia = ({ initialSlide, media }) => {
  const { classes } = useStyles();
  const settings = useWidgetSettings('@shopgate/engage/product/Gallery');

  if (!Array.isArray(media) || media.length === 0) {
    return <div className={classes.container} />;
  }

  const { GalleryImage: galleryResolutions } = getProductImageSettings();

  const sliderClassNames = {
    container: classes.swiperContainer,
    indicator: classes.indicator,
  };

  return (
    <div className={classes.container}>
      <Swiper
        paginationType={pdpImageSliderPaginationType}
        classNames={sliderClassNames}
        className={classes.slider}
        initialSlide={initialSlide}
        indicators
        loop={media.length > 1}
        disabled={media.length === 1}
        zoom={{
          ...GALLERY_SLIDER_ZOOM,
          ...settings.zoom,
        }}
      >
        {media.map(singleMedia => (
          <Swiper.Item key={singleMedia.url}>
            <div className="swiper-zoom-container">
              <Image
                src={singleMedia.url}
                alt={singleMedia.altText}
                classNameImg={classes.slide}
                resolutions={galleryResolutions}
                unwrapped
              />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  );
};

ProductGalleryMedia.propTypes = {
  initialSlide: PropTypes.number.isRequired,
  media: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    altText: PropTypes.string,
  })).isRequired,
};

export default connect(ProductGalleryMedia);
