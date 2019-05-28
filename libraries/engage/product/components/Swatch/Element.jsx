import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';

/**
 * The swatch-element component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Element = ({
  testId,
  field,
  style,
  selectionStyles,
  selected,
}) => {
  const { ...stylesBySelection } = selectionStyles[selected];
  const commonClassName = `${
    typeof style === 'object'
      ? css(style).toString()
      : style
  } ${
    css(stylesBySelection).toString()
  }`;

  return (
    <Fragment>
      { field.imageUrl && !field.color && (
        <li
          data-test-id={testId}
          // Fix background image to always show a texture
          className={
            `${commonClassName} ${css({ backgroundImage: `url(${field.imageUrl})` })}`
          }
        />
      ) }
      { !field.imageUrl && field.color && (
        <li
          data-test-id={testId}
          // Fix color field background color to the selected value
          className={
            `${commonClassName} ${css({ backgroundColor: field.color })}`
          }
        />
      ) }
    </Fragment>
  );
};

const selectionStyle = PropTypes.shape({
  borderColor: PropTypes.string,
});

Element.propTypes = {
  // Contains only imageUrl or color, never both
  field: PropTypes.shape({
    imageUrl: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  selectionStyles: PropTypes.shape({
    selected: selectionStyle,
    unselected: selectionStyle,
  }).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]).isRequired,
  testId: PropTypes.string.isRequired,
  selected: PropTypes.string,
};

Element.defaultProps = {
  selected: 'unselected',
};

export default Element;
