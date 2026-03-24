import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core';
import { getProductImageSettings } from '@shopgate/engage/product/helpers';
import { Image, SurroundPortals, Swiper } from '@shopgate/engage/components';
import { PRODUCT_GALLERY_IMAGES } from '@shopgate/engage/product';
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
 * The Product Gallery content component.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const ProductGalleryImages = ({ initialSlide, images }) => {
  const { classes } = useStyles();
  const { zoom = {} } = useWidgetSettings('@shopgate/engage/product/Gallery') || {};

  const { GalleryImage: galleryResolutions } = getProductImageSettings();

  const sliderClassNames = {
    container: classes.swiperContainer,
    indicator: classes.indicator,
  };

  if (!Array.isArray(images) || images.length === 0) {
    return <div className={classes.container} />;
  }

  return (
    <div className={classes.container}>
      <Swiper
        paginationType={pdpImageSliderPaginationType}
        classNames={sliderClassNames}
        className={classes.slider}
        initialSlide={initialSlide}
        indicators
        loop={images.length > 1}
        disabled={images.length === 1}
        zoom={{
          ...GALLERY_SLIDER_ZOOM,
          ...zoom,
        }}
      >
        {images.map(image => (
          <Swiper.Item key={image}>
            <div className="swiper-zoom-container">
              <Image
                src={image}
                alt=""
                classNameImg={classes.slide}
                resolutions={galleryResolutions}
                animating={false}
                backgroundColor="transparent"
                unwrapped
              />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  );
};

ProductGalleryImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialSlide: PropTypes.number.isRequired,
};

/**
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Wrapper = props => (
  <SurroundPortals portalName={PRODUCT_GALLERY_IMAGES} portalProps={props}>
    <ProductGalleryImages {...props} />
  </SurroundPortals>
);

export default connect(Wrapper);
