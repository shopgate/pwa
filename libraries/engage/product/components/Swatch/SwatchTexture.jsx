import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchTexture = ({
  imageUrl, className, onClick, valueId,
}) => (
  <li
    aria-hidden
    onClick={() => onClick(valueId)}
    className={className}
    style={{ backgroundImage: `url(${imageUrl})` }}
  />
);

SwatchTexture.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  valueId: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
};

SwatchTexture.defaultProps = {
  className: null,
  onClick: noop,
};

export default SwatchTexture;
