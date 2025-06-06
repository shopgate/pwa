import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import Select from '@shopgate/pwa-ui-shared/Form/Select';
import FormHelper from './FormHelper';

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} props Component props.
 * @param {Object} props.element The data of the element to be rendered
 * @returns {JSX.Element}
 */
const ElementSelect = (props) => {
  const {
    element,
    errorText,
    name,
    value,
    visible,
    formName,
  } = props;

  if (!visible) {
    return null;
  }
  const {
    label, placeholder, required, options, disabled, handleChange,
  } = element;

  return (
    <div
      className={classNames(
        camelCase(name),
        'engage__form-select',
        'formBuilderField',
        { validationError: !!errorText }
      )}
    >
      <Select
        name={name}
        required={required}
        label={label}
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={handleChange}
        errorText={errorText}
        isControlled
        translateErrorText={false}
        showErrorText={false}
        disabled={disabled}
        aria-invalid={!!errorText}
        aria-describedby={errorText.length > 0 ? `ariaError-${name}` : null}
      />
      <FormHelper
        errorText={errorText}
        element={element}
        formName={formName}
        elementName={name}
      />
    </div>
  );
};

ElementSelect.propTypes = {
  element: PropTypes.shape().isRequired,
  errorText: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.number.isRequired,
  ]),
  visible: PropTypes.bool,
};

ElementSelect.defaultProps = {
  value: '',
  visible: true,
};

export default memo(ElementSelect);
