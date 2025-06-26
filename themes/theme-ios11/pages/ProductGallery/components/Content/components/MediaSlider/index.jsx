import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { getProductImageSettings } from '@shopgate/engage/product/helpers';
import { Swiper, Image } from '@shopgate/engage/components';
import { appConfig } from '@shopgate/engage';
import { GALLERY_SLIDER_ZOOM } from '../../../../constants';
import styles from './style';
import connect from './connector';

const { pdpImageSliderPaginationType } = appConfig || {};

/**
 * The Product media gallery component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const ProductGalleryMedia = ({ initialSlide, media }) => {
  const settings = useWidgetSettings('@shopgate/engage/product/Gallery');

  if (!Array.isArray(media) || media.length === 0) {
    return <div className={styles.container} />;
  }

  const { GalleryImage: galleryResolutions } = getProductImageSettings();

  return (
    <div className={styles.container}>
      <Swiper
        paginationType={pdpImageSliderPaginationType}
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
              <Image
                src={singleMedia.url}
                alt={singleMedia.altText}
                classNameImg={styles.slide}
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
