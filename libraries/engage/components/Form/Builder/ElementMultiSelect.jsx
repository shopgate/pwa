import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import Select from '@shopgate/pwa-ui-shared/Form/Select';

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} props Component props.
 * @param {Object} props.element The data of the element to be rendered
 * @returns {JSX}
 */
const ElementMultiSelect = (props) => {
  const {
    element,
    errorText,
    name,
    value,
    visible,
  } = props;

  if (!visible) {
    return null;
  }

  const values = [].concat(value);
  // Limit to number of options or max 3
  const size = Math.min(3, Object.keys(element.options).length);

  return (
    <div className={classNames(camelCase(name), { validationError: !!errorText })}>
      <Select
        name={name}
        label={element.label}
        placeholder={element.placeholder}
        value={values}
        options={element.options}
        onChange={element.handleChange}
        errorText={errorText}
        isControlled
        translateErrorText={false}
        disabled={element.disabled}
        multiple
        size={size}
      />
    </div>
  );
};

ElementMultiSelect.propTypes = {
  element: PropTypes.shape().isRequired,
  errorText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  visible: PropTypes.bool,
};

ElementMultiSelect.defaultProps = {
  value: '',
  visible: true,
};

export default memo(ElementMultiSelect);
