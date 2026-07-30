import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '@shopgate/engage/components';
import connect from './connector';

/**
 * The CategoryImage component
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const CategoryImage = ({ className, src, placeholderSrc }) => {
  if (!src && !placeholderSrc) {
    return null;
  }

  return (
    <Image
      className={className}
      src={src}
      // Unwrapped, so the fallback renders into the container the outer Image already provides
      // rather than nesting a second aspect ratio box inside it.
      placeholder={placeholderSrc ? <Image unwrapped src={placeholderSrc} /> : null}
    />
  );
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
