import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import ProductImage from 'Components/ProductImage';
import { PRODUCT_SLIDER_IMAGE_FORMATS } from './../../../../../../constants';
import styles from '../style';

/**
 * The product media video slide component.
 */
class MediaImage extends Component {
  static propTypes = {
    media: PropTypes.shape({
      altText: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  /**
   * @param {Object} nextProps the next props
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.media, nextProps.media);
  }

  handleClick = () => {
    this.props.onClick();
  }

  /**
   * Renders the product media slider component.
   * @returns {JSX}
   */
  render() {
    const { media } = this.props;

    return (
      <div
        onClick={this.handleClick}
        onKeyDown={this.handleClick}
        role="button"
        tabIndex="0"
        className={styles.full}
      >
        <ProductImage
          src={media.url}
          alt={media.altText}
          resolutions={[PRODUCT_SLIDER_IMAGE_FORMATS[0]]}
        />
      </div>
    );
  }
}

export default MediaImage;
