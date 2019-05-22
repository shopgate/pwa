import React from 'react';
import PropTypes from 'prop-types';
import ProductImage from '../../../ProductImage';
import { PRODUCT_SLIDER_IMAGE_FORMATS } from '../../constants';
import styles from '../../style';

/**
 * The product media video slide component.
 * @returns {JSX}
 */
const MediaImage = ({ media, onClick }) => (
  <div
    onClick={onClick}
    onKeyDown={onClick}
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

MediaImage.propTypes = {
  media: PropTypes.shape({
    altText: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MediaImage;
