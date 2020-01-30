import React from 'react';
import PropTypes from 'prop-types';
import RadioGroup from '@shopgate/pwa-ui-shared/Form/RadioGroup';
import RadioItem from '@shopgate/pwa-ui-shared/Form/RadioGroup/components/Item';

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} props Component props.
 * @param {Object} props.element The data of the element to be rendered
 * @returns {JSX}
 */
const ElementRadio = (props) => {
  const {
    element,
    errorText,
    name,
    style,
    value,
  } = props;

  return (
    <RadioGroup
      name={name}
      className={style.fields}
      label={element.label}
      value={value}
      onChange={element.handleChange}
      errorText={errorText}
      isControlled
      translateErrorText={false}
    >
      {Object.keys(element.options).map(itemName => (
        <RadioItem
          key={itemName}
          name={itemName}
          label={element.options[itemName]}
        />
      ))}
    </RadioGroup>
  );
};

ElementRadio.propTypes = {
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

ElementRadio.defaultProps = {
  value: '',
  style: { fields: '' },
};

export default ElementRadio;
