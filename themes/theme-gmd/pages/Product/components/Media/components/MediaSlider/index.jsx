import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Swiper, Portal } from '@shopgate/pwa-common/components';
import {
  PRODUCT_IMAGE,
  PRODUCT_IMAGE_AFTER,
  PRODUCT_IMAGE_BEFORE,
  MEDIA_TYPE_IMAGE,
  MEDIA_TYPE_VIDEO,
} from '@shopgate/pwa-common-commerce/product';
import Image from './components/Image';
import Video from './components/Video';
import connect from './connector';

const typeRenders = {
  [MEDIA_TYPE_IMAGE]: Image,
  [MEDIA_TYPE_VIDEO]: Video,
};

/**
 * The product media slider component.
 * @param {number} currentSlide The index of the current visible slide.
 */
class MediaSlider extends Component {
  static propTypes = {
    media: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      code: PropTypes.string,
      altText: PropTypes.string,
      subTitle: PropTypes.string,
      url: PropTypes.string,
    })),
    navigate: PropTypes.func,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    media: null,
    product: null,
    navigate: () => { },
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.product !== nextProps.product || this.props.navigate !== nextProps.navigate) {
      return true;
    }

    if (this.props.media && nextProps.media) {
      if (this.props.media.length !== nextProps.media.length) return true;
    }

    return !isEqual(this.props.media, nextProps.media);
  }

  currentSlide = 0;

  handleOpenGallery = () => {
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
    const { product, media = [] } = this.props;

    return (
      <Fragment>
        <Portal name={PRODUCT_IMAGE_BEFORE} />
        <Portal name={PRODUCT_IMAGE}>
          <div
            data-test-id={`product: ${product ? product.name : ''}`}
            onClick={this.handleOpenGallery}
            onKeyDown={this.handleOpenGallery}
            role="button"
            tabIndex="0"
          >
            <Swiper
              loop={media.length > 1}
              indicators
              onSlideChange={this.handleSlideChange}
              disabled={media.length === 1}
            >
              {media.map((singleMedia) => {
                const Type = typeRenders[singleMedia.type];
                return (
                  <Swiper.Item key={`${product.id}-${singleMedia.type}-${singleMedia.url}`}>
                    <Type media={singleMedia} />
                  </Swiper.Item>
                );
              })}
            </Swiper>
          </div>
        </Portal>
        <Portal name={PRODUCT_IMAGE_AFTER} />
      </Fragment>
    );
  }
}

export default connect(MediaSlider);
