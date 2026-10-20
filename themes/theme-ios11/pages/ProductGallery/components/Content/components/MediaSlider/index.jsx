import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { useProductImageSettings } from '@shopgate/engage/settings/hooks';
import { Swiper, Image } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { GALLERY_SLIDER_ZOOM } from '../../../../constants';
import { useGalleryPagination } from '../../../../hooks';
import connect from './connector';

const fullSize = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const useStyles = makeStyles()(theme => ({
  container: {
    ...fullSize,
    background: theme.palette.common.black,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  slider: {
    height: '100%',
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
      `calc(2px + ${theme.layout.safeArea.bottom})`,
    ],
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
}));

/**
 * The Product media gallery component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGalleryMedia = ({ initialSlide, media }) => {
  const { classes, cx } = useStyles();
  const { gallery } = useProductImageSettings();
  const {
    ref, style, paginationType, className: paginationClassName,
  } = useGalleryPagination(gallery);
  const settings = useWidgetSettings('@shopgate/engage/product/Gallery');

  if (!Array.isArray(media) || media.length === 0) {
    return <div ref={ref} className={classes.container} />;
  }

  const sliderClassNames = {
    container: classes.swiperContainer,
    indicator: classes.indicator,
  };

  return (
    <div ref={ref} className={classes.container} style={style}>
      <Swiper
        key={paginationType}
        paginationType={paginationType}
        classNames={sliderClassNames}
        className={cx(classes.slider, paginationClassName)}
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
                resolutions={gallery.resolutions}
                ratio={gallery.ratio}
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
