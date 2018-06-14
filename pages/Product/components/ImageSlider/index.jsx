import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Hammer from '@shopgate/react-hammerjs';
import ProductImage from 'Components/ProductImage';
import BaseImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';
import connect from './connector';

const resolutions = [
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
 * The product image slider component.
 * @param {number} currentSlide The index of the current visible slide.
 * @param {Object} props The component props.
 * @param {Object} props.product Basic product data from the product state.
 * @param {Array} props.images Array of image urls.
 */
class ImageSlider extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
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

    if (!images || !images.length) {
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

    let content = null;

    if (!product || !images || images.length === 0) {
      content = (
        <ProductImage
          src={product ? product.featuredImageUrl : null}
          forcePlaceholder={!product}
          resolutions={resolutions}
        />
      );
    } else {
      content = (
        <BaseImageSlider loop indicators onSlideChange={this.handleSlideChange}>
          {images.map(image => (
            <ProductImage key={image} src={image} animating={false} resolutions={resolutions} />
          ))}
        </BaseImageSlider>
      );
    }

    return (
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
    );
  }
}

export default connect(ImageSlider);
