import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import Select from '@shopgate/pwa-ui-shared/Form/Select';
import SelectContextChoices from '@shopgate/pwa-ui-shared/Form/SelectContextChoices';
import ResponsiveContainer from '../../ResponsiveContainer/ResponsiveContainer';
import FormHelper from './FormHelper';

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
    formName,
  } = props;

  if (!visible) {
    return null;
  }

  const values = [].concat(value).filter(Boolean);

  return (
    <div className={classNames(camelCase(name), 'formBuilderField', { validationError: !!errorText })}>
      <ResponsiveContainer appAlways breakpoint="xs">
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
          showErrorText={false}
          disabled={element.disabled}
          multiple
        />
      </ResponsiveContainer>
      <ResponsiveContainer webOnly breakpoint=">xs">
        <SelectContextChoices
          label={element.label}
          placeholder={element.placeholder}
          value={values}
          options={element.options}
          onChange={element.handleChange}
          errorText={errorText}
          showErrorText={false}
        />
      </ResponsiveContainer>
      <FormHelper
        errorText={errorText}
        element={element}
        formName={formName}
      />
    </div>
  );
};

ElementMultiSelect.propTypes = {
  element: PropTypes.shape().isRequired,
  errorText: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
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
