import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
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
    value,
  } = props;

  return (
    <div className={camelCase(name)}>
      <RadioGroup
        name={name}
        label={element.label}
        value={value}
        onChange={element.handleChange}
        errorText={errorText}
        isControlled
        translateErrorText={false}
      >
        {Object.keys(element.options).map(itemName => (
          <div className={`${camelCase(name)}_${camelCase(itemName)}`}>
            <RadioItem
              key={`${name}_${itemName}`}
              id={`${name}_${camelCase(itemName)}`}
              name={itemName}
              label={element.options[itemName]}
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

ElementRadio.propTypes = {
  element: PropTypes.shape().isRequired,
  errorText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.number.isRequired,
  ]),
};

ElementRadio.defaultProps = {
  value: '',
};

export default memo(ElementRadio);
