import React, { memo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { item, itemTexture } from './style';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export const SwatchTexture = memo(({
  testId, imageUrl, className, onClick, valueId,
}) => (
  <li
    data-value-id={valueId}
    data-test-id={testId}
    aria-hidden
    onClick={onClick}
    className={classNames(item, itemTexture, className)}
    style={{ backgroundImage: `url(${imageUrl})` }}
  />
));

SwatchTexture.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
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

SwatchTexture.defaultProps = {};
