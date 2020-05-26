import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { formatFloat } from '../QuantityInput/helper';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const QuantityLabel = ({
  value,
  maxDecimals,
  unit,
  className,
}) => {
  const output = useMemo(() => {
    const formatted = formatFloat(value, maxDecimals);
    return unit ? `${formatted} ${unit}` : formatted;
  }, [maxDecimals, unit, value]);

  return (
    <span className={className}>
      {output}
    </span>
  );
};

QuantityLabel.propTypes = {
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
  maxDecimals: PropTypes.number,
  unit: PropTypes.string,
};

QuantityLabel.defaultProps = {
  className: '',
  maxDecimals: 2,
  unit: null,
};

export default QuantityLabel;
