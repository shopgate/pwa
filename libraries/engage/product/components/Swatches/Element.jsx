import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Element = ({ testId, field, style }) => (
  <div className={css(style).toString()} data-test-id={testId}>
    {field.imageUrl && !field.color && 'imageField'}
    {!field.imageUrl && field.color && 'colorField'}
  </div>
);

Element.propTypes = {
  // Contains only imageUrl or color, never both
  field: PropTypes.shape({
    imageUrl: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  style: PropTypes.shape().isRequired,
  testId: PropTypes.string.isRequired,
};

Element.defaultProps = {};

export default Element;
