import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import UICheckbox from '@shopgate/pwa-ui-shared/Checkbox';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import style from './style';

/**
 * A component that provides a styled checkbox field.
 * @returns {JSX}
 */
const Checkbox = ({
  name, label, errorText, onChange, className, ...props
}) => (
  <FormElement
    className={className}
    htmlFor={name}
    errorText={errorText}
    hasUnderline={false}
    hasPlaceholder={false}
  >
    <UICheckbox
      {...props}
      defaultChecked
      name={name}
      onCheck={onChange}
      checkedClassName={className}
      unCheckedClassName={className}
      labelPosition="right"
      label={
        <I18n.Text className={style.label} string={label} />
          }
    />
  </FormElement>
);

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  errorText: PropTypes.node,
  label: PropTypes.node,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  className: '',
  errorText: '',
  label: '',
  onChange: () => {},
};

export default Checkbox;
