import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';

/**
 * The swatch component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Swatch = ({ testId, style, children }) => (
  <div data-test-id={testId} className={css(style).toString()}>
    {children}
  </div>
);

Swatch.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]).isRequired,
  testId: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Swatch.defaultProps = {
  children: null,
};

export default Swatch;
