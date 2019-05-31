import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export const SwatchColor = memo(({
  testId,
  color,
  className,
}) => (
  <li
    data-test-id={testId}
    // Fix color field background color to the selected value
    className={className}
    style={{ backgroundColor: color }}
  />
));

SwatchColor.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]).isRequired,
  color: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

SwatchColor.defaultProps = {};
