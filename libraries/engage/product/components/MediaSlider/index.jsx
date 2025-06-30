import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals, Swiper } from '@shopgate/engage/components';
import { PRODUCT_MEDIA } from '@shopgate/pwa-common-commerce/product';
import { MEDIA_TYPE_IMAGE, MEDIA_TYPE_VIDEO } from '../../constants';
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
 * @returns {JSX.Element}
 */
const MediaSlider = ({
  navigate,
  featuredMedia,
  media,
  'aria-hidden': ariaHidden,
  renderPlaceholder,
  className,
  paginationType,
}) => {
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

  if (!Array.isArray(media) || media.length === 0) {
    return renderPlaceholder(featuredMedia);
  }

  return (
    <div className={container}>
      <SurroundPortals portalName={PRODUCT_MEDIA}>
        {media &&
          <Swiper
            paginationType={paginationType}
            loop={media.length > 1}
            indicators
            onSlideChange={setCurrentSlide}
            disabled={media.length === 1}
            controls={media.some(m => m.type === MEDIA_TYPE_VIDEO)}
            className={className}
            aria-hidden={ariaHidden}
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
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
  featuredMedia: PropTypes.shape({
    type: PropTypes.string,
    code: PropTypes.string,
    altText: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
  media: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    code: PropTypes.string,
    altText: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  })),
  paginationType: PropTypes.string,
  renderPlaceholder: PropTypes.func,
};

MediaSlider.defaultProps = {
  'aria-hidden': null,
  className: null,
  featuredMedia: null,
  paginationType: null,
  media: null,
  renderPlaceholder: featuredMedia => (<MediaImage {...featuredMedia} />),
};

export default connect(MediaSlider);
