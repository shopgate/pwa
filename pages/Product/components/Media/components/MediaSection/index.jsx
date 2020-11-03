import React from 'react';
import PropTypes from 'prop-types';
import { useLoadProductImage } from '@shopgate/engage/product';

/**
 * @param {Object} props .
 * @return {JSX}
 */
const MediaSection = ({
  onClick, children, 'aria-hidden': ariaHidden, product,
}) => {
  const loadedImageSrc = useLoadProductImage(product && product.featuredImageBaseUrl);

  return (
    <div
      data-test-id={`product: ${product ? product.name : ''}`}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex="0"
      aria-hidden={ariaHidden}
      style={{
        backgroundImage: loadedImageSrc && `url(${loadedImageSrc})`,
        backgroundSize: 'contain',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {children}
    </div>
  );
};

MediaSection.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  'aria-hidden': PropTypes.bool,
  product: PropTypes.shape(),
};

MediaSection.defaultProps = {
  'aria-hidden': null,
  product: null,
};

export default MediaSection;
