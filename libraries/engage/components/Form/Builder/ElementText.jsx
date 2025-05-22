import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import TextField from '@shopgate/pwa-ui-shared/TextField';
import FormHelper from './FormHelper';

import {
  ELEMENT_TYPE_TEXT,
  ELEMENT_TYPE_NUMBER,
  ELEMENT_TYPE_EMAIL,
  ELEMENT_TYPE_PASSWORD,
  ELEMENT_TYPE_DATE,
  ELEMENT_TYPE_PHONE,
} from './Builder.constants';

// Map element type to input type
const mapping = {
  [ELEMENT_TYPE_TEXT]: 'text',
  [ELEMENT_TYPE_NUMBER]: 'number',
  [ELEMENT_TYPE_EMAIL]: 'email',
  [ELEMENT_TYPE_PASSWORD]: 'password',
  [ELEMENT_TYPE_DATE]: 'date',
  [ELEMENT_TYPE_PHONE]: 'tel',
};

/**
 * Takes an element and renders it, if the type matches
 * @param {Object} props Component props.
 * @param {Object} props.element The data of the element to be rendered
 * @returns {JSX.Element}
 */
const ElementText = (props) => {
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
    required, disabled, handleChange, label,
  } = element;

  const type = mapping[element.type];

  return (
    <div
      className={classNames(
        camelCase(name),
        'engage__form-text',
        'formBuilderField',
        { validationError: !!errorText }
      )}
      tabIndex={-1}
    >
      <TextField
        required={required}
        aria-required={required}
        type={type}
        name={name}
        label={label}
        value={value}
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

ElementText.propTypes = {
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

ElementText.defaultProps = {
  value: '',
  visible: true,
};

export default memo(ElementText);
