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
export const SwatchColor = memo(({
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
));

SwatchColor.propTypes = {
  color: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
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

SwatchColor.defaultProps = {};
