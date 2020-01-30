import React from 'react';
import PropTypes from 'prop-types';
import Select from '@shopgate/pwa-ui-shared/Form/Select';

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} props Component props.
 * @param {Object} props.element The data of the element to be rendered
 * @returns {JSX}
 */
const ElementSelect = (props) => {
  const {
    element,
    errorText,
    name,
    style,
    value,
  } = props;

  return (
    <Select
      name={name}
      className={style.fields}
      label={element.label}
      placeholder={element.placeholder}
      value={value}
      options={element.options}
      onChange={element.handleChange}
      errorText={errorText}
      isControlled
      translateErrorText={false}
    />
  );
};

ElementSelect.propTypes = {
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

ElementSelect.defaultProps = {
  value: '',
  style: { fields: '' },
};

export default ElementSelect;
