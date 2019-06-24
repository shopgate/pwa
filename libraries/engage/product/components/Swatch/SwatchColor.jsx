import React, { memo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { item } from './style';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchColorUnwrapped = ({
  testId, color, className, onClick, valueId,
}) => (
  <li
    data-value-id={valueId}
    data-test-id={testId}
    aria-hidden
    onClick={onClick}
    className={classNames(item, className)}
    style={{ backgroundColor: color }}
  />
);

SwatchColorUnwrapped.propTypes = {
  color: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  valueId: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
};

SwatchColorUnwrapped.defaultProps = {
  className: null,
  onClick: noop,
};

SwatchColorUnwrapped.displayName = 'SwatchColor';

export const SwatchColor = memo(SwatchColorUnwrapped);

SwatchColor.displayName = `Memo(${SwatchColorUnwrapped.displayName})`;
