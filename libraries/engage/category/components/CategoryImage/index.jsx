import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Image } from '@shopgate/engage/components';
import connect from './connector';

/**
 * The CategoryImage component
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CategoryImage = ({ className, src, placeholderSrc }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(!src);

  const onImageError = useCallback(() => {
    setShowPlaceholder(true);
  }, [setShowPlaceholder]);

  if (!showPlaceholder) {
    return (<Image className={className} src={src} onError={onImageError} />);
  }

  if (!placeholderSrc) {
    return null;
  }

  return (<Image key="placeholder" className={className} src={placeholderSrc} />);
};

CategoryImage.propTypes = {
  className: PropTypes.string,
  placeholderSrc: PropTypes.string,
  src: PropTypes.string,
};

CategoryImage.defaultProps = {
  src: null,
  placeholderSrc: null,
  className: null,
};

export default connect(CategoryImage);
