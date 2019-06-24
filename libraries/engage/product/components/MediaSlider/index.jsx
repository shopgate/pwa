import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals, Swiper } from '@shopgate/engage/components';
import {
  PRODUCT_MEDIA,
  MEDIA_TYPE_IMAGE,
  MEDIA_TYPE_VIDEO,
} from '@shopgate/pwa-common-commerce/product';
import MediaImage from './components/MediaImage';
import MediaVideo from './components/MediaVideo';
import connect from './connector';
import { container } from './style';

const typeRenders = {
  [MEDIA_TYPE_IMAGE]: MediaImage,
  [MEDIA_TYPE_VIDEO]: MediaVideo,
};

/**
 * The product media slider component.
 * @returns {JSX}
 */
const MediaSlider = ({ navigate, media }) => {
  let currentSlide = 0;

  /**
   * @param {number} slide slide
   */
  const setCurrentSlide = (slide) => {
    currentSlide = slide;
  };

  /** Handle click */
  const handleSlideClick = () => {
    if (!media.length) {
      return;
    }
    navigate(currentSlide);
  };

  return (
    <div className={container}>
      <SurroundPortals portalName={PRODUCT_MEDIA}>
        {media &&
          <Swiper
            loop={media.length > 1}
            indicators
            onSlideChange={setCurrentSlide}
            disabled={media.length === 1}
            controls={media.some(m => m.type === MEDIA_TYPE_VIDEO)}
          >
            {media.map((singleMedia) => {
              const Type = typeRenders[singleMedia.type];
              return (
                <Swiper.Item key={Object.values(singleMedia).join('_')}>
                  <Type media={singleMedia} onClick={handleSlideClick} />
                </Swiper.Item>
              );
            })}
          </Swiper>
        }
      </SurroundPortals>
    </div>
  );
};

MediaSlider.propTypes = {
  navigate: PropTypes.func.isRequired,
  media: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    code: PropTypes.string,
    altText: PropTypes.string,
    subTitle: PropTypes.string,
    url: PropTypes.string,
  })),
};

MediaSlider.defaultProps = {
  media: null,
};

export default connect(MediaSlider);
