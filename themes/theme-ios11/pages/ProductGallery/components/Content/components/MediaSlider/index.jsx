import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings, getFullImageSource } from '@shopgate/engage/core';
import { Swiper } from '@shopgate/engage/components';
import { GALLERY_SLIDER_ZOOM, GALLERY_SLIDER_IMAGE_FORMATS } from '../../../../constants';
import styles from './style';
import connect from './connector';

/**
 * The Product media gallery component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGalleryMedia = ({ initialSlide, media }) => {
  if (!Array.isArray(media) || media.length === 0) {
    return <div className={styles.container} />;
  }

  const settings = useWidgetSettings('@shopgate/engage/product/Gallery');

  return (
    <div className={styles.container}>
      <Swiper
        classNames={styles.sliderStyles}
        className={styles.slider}
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
              <img
                src={getFullImageSource(singleMedia.url, GALLERY_SLIDER_IMAGE_FORMATS[1])}
                alt={singleMedia.altText}
                className={styles.slide}
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
