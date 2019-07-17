import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchColor = ({
  color, className, onClick, valueId,
}) => (
  <li
    aria-hidden
    onClick={() => onClick(valueId)}
    className={className}
    style={{ backgroundColor: color }}
  />
);

SwatchColor.propTypes = {
  color: PropTypes.string.isRequired,
  valueId: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
};

SwatchColor.defaultProps = {
  className: null,
  onClick: noop,
};

export default SwatchColor;
