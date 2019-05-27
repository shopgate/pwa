import React from 'react';
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
  colorFieldStyle,
  textureFieldStyle,
  selectionSettings,
  selected,
}) => {
  const { ...selectionSetting } = selectionSettings[selected];
  return (
    <li
      data-test-id={testId}
      className={css({
        ...style,
        // Disable overriding switch configurations, configure instead of styling!
        ...selectionSetting,
      })}
    >
      { field.imageUrl && !field.color && (
        <div
          className={css({
            height: '100%',
            width: '100%',
            ...textureFieldStyle,
            // Fix background image to always show a texture
            backgroundImage: `url(${field.imageUrl})`,
          })}
        />
      ) }
      { !field.imageUrl && field.color && (
        <div
          className={css({
            height: '100%',
            width: '100%',
            ...colorFieldStyle,
            // Fix color field background color to the selected value
            backgroundColor: field.color,
          })}
        />
      ) }
    </li>
  );
};

const selectionSetting = PropTypes.shape({
  boxShadow: PropTypes.string,
});

Element.propTypes = {
  colorFieldStyle: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]).isRequired,
  // Contains only imageUrl or color, never both
  field: PropTypes.shape({
    imageUrl: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  selectionSettings: PropTypes.shape({
    selected: selectionSetting,
    unselected: selectionSetting,
  }).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]).isRequired,
  testId: PropTypes.string.isRequired,
  textureFieldStyle: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]).isRequired,
  selected: PropTypes.string,
};

Element.defaultProps = {
  selected: 'unselected',
};

export default Element;
