import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@shopgate/pwa-ui-shared/Form/Checkbox';

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} props Component props.
 * @param {Object} props.element The data of the element to be rendered
 * @returns {JSX}
 */
const ElementCheckbox = (props) => {
  const {
    element,
    style,
    errorText,
    value,
    name,
  } = props;

  return (
    <Checkbox
      name={name}
      errorText={errorText}
      checked={value}
      className={style.fields}
      label={element.label}
      onChange={element.handleChange}
      translateErrorText={false}
    />
  );
};

ElementCheckbox.propTypes = {
  element: PropTypes.shape().isRequired,
  errorText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.shape(),
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.number.isRequired,
  ]),
};

ElementCheckbox.defaultProps = {
  value: false,
  style: { fields: '' },
};

export default ElementCheckbox;
