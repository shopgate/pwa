import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { SurroundPortals, Swiper } from '@shopgate/engage/components';
import {
  PRODUCT_IMAGE,
  MEDIA_TYPE_IMAGE,
  MEDIA_TYPE_VIDEO,
} from '@shopgate/pwa-common-commerce/product';
import MediaImage from './components/MediaImage';
import MediaVideo from './components/MediaVideo';
import connect from './connector';

const typeRenders = {
  [MEDIA_TYPE_IMAGE]: MediaImage,
  [MEDIA_TYPE_VIDEO]: MediaVideo,
};

/**
 * The product media slider component.
 * @param {number} currentSlide The index of the current visible slide.
 */
class MediaSlider extends Component {
  static propTypes = {
    navigate: PropTypes.func.isRequired,
    media: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      code: PropTypes.string,
      altText: PropTypes.string,
      subTitle: PropTypes.string,
      url: PropTypes.string,
    })),
  };

  static defaultProps = {
    media: null,
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.media && nextProps.media) {
      if (this.props.media.length !== nextProps.media.length) return true;
    }

    return !isEqual(this.props.media, nextProps.media);
  }

  currentSlide = 0;

  handleSlideClick = () => {
    const { media = [] } = this.props;
    if (!media.length) {
      return;
    }

    this.props.navigate(this.currentSlide);
  };

  handleSlideChange = (currentSlide) => {
    this.currentSlide = currentSlide;
  };

  /**
   * Renders the product media slider component.
   * @returns {JSX}
   */
  render() {
    const { media = [] } = this.props;

    return (
      <Fragment>
        <SurroundPortals portalName={PRODUCT_IMAGE} />
        <Swiper
          loop={media.length > 1}
          indicators
          onSlideChange={this.handleSlideChange}
          disabled={media.length === 1}
        >
          {media.map((singleMedia) => {
            const Type = typeRenders[singleMedia.type];
            return (
              <Swiper.Item key={Object.values(singleMedia).join('_')}>
                <Type media={singleMedia} onClick={this.handleSlideClick} />
              </Swiper.Item>
            );
          })}
        </Swiper>
      </Fragment>
    );
  }
}

export default connect(MediaSlider);
