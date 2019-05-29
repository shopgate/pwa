import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchTexture = ({
  testId,
  imageUrl,
  className,
}) => (
  <li
    data-test-id={testId}
    // Fix background image to always show a texture
    className={className}
    style={{ backgroundImage: `url(${imageUrl})` }}
  />
);

SwatchTexture.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]).isRequired,
  imageUrl: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

SwatchTexture.defaultProps = {};

export default memo(SwatchTexture);
