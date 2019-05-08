import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import ProductImage from 'Components/ProductImage';
import { PRODUCT_SLIDER_IMAGE_FORMATS } from './../../../../../constants';

/**
 * The product media video slide component.
 */
class Image extends Component {
  static propTypes = {
    media: PropTypes.shape({
      altText: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.media, nextProps.media);
  }

  /**
   * Renders the product media slider component.
   * @returns {JSX}
   */
  render() {
    const { media } = this.props;

    return (
      <ProductImage
        src={media.url}
        alt={media.altText}
        resolutions={PRODUCT_SLIDER_IMAGE_FORMATS[0]}
      />
    );
  }
}

export default Image;
