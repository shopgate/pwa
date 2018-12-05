import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_IMAGE,
  PRODUCT_IMAGE_AFTER,
  PRODUCT_IMAGE_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import Hammer from 'react-hammerjs';
import ProductImage from 'Components/ProductImage';
import BaseImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';
import connect from './connector';

const fallbackResolutions = [
  {
    width: 440,
    height: 440,
  },
  {
    width: 1024,
    height: 1024,
  },
];

/**
 * reformats the images array to group pictures by index, not by format
 * @param {Array} images array of format images
 * @returns {Array}
 */
const getImagesByIndex = (images) => {
  const imagesByIndex = [];

  images.forEach((format) => {
    if (!format.sources || !format.sources.length) return;
    format.sources.forEach((src, index) => {
      if (!imagesByIndex[index]) imagesByIndex[index] = [];
      imagesByIndex[index].push(src);
    });
  });

  return imagesByIndex;
};

/**
 * The product image slider component.
 * @param {number} currentSlide The index of the current visible slide.
 */
class ImageSlider extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape()),
    navigate: PropTypes.func,
    product: PropTypes.shape(),
  };

  static defaultProps = {
    images: null,
    product: null,
    navigate: () => {},
  };

  currentSlide = 0;

  handleOpenGallery = () => {
    const { images } = this.props;

    if (!images || (Array.isArray(images) && !images.length)) {
      return;
    }

    this.props.navigate(this.currentSlide);
  };

  handleSlideChange = (currentSlide) => {
    this.currentSlide = currentSlide;
  };

  /**
   * Renders the product image slider component.
   * @returns {JSX}
   */
  render() {
    const { product, images } = this.props;
    let content;

    if (Array.isArray(images)) {
      const imagesByIndex = getImagesByIndex(images);
      
      if (imagesByIndex.length) {
        let counter = 0
        content = (
          <BaseImageSlider loop indicators onSlideChange={this.handleSlideChange}>
            {imagesByIndex.map(imagesInIndex => (
              <ProductImage
                key={`${product.id}-${++counter}`}
                srcmap={imagesInIndex}
                animating={false}
              />
            ))}
          </BaseImageSlider>
        );
      }
    }

    if (!content) {
      content = (
        <ProductImage
          src={product ? product.featuredImageUrl : null}
          forcePlaceholder={!product}
          resolutions={fallbackResolutions}
        />
      );
    }

    return (
      <Fragment>
        <Portal name={PRODUCT_IMAGE_BEFORE} />
        <Portal name={PRODUCT_IMAGE}>
          <Hammer
            onPinchStart={this.handleOpenGallery}
            onTap={this.handleOpenGallery}
            direction="DIRECTION_ALL"
            options={{
              touchAction: 'pan-x pan-y',
              recognizers: {
                pinch: { enable: true },
              },
            }}
          >
            <div>{content}</div>
          </Hammer>
        </Portal>
        <Portal name={PRODUCT_IMAGE_AFTER} />
      </Fragment>
    );
  }
}

export default connect(ImageSlider);
