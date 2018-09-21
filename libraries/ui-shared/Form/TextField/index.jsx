import React from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import Grid from '@shopgate/pwa-common/components/Grid';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import style from './style';

/**
 * No operational
 */
const noop = () => {};

/**
 * A component that provides a styled text field.
 * @returns {JSX}
 */
const TextField = ({
  className, placeholder, label, errorText, leftElement, rightElement, ...props
}) => (
  <FormElement
    className={className}
    htmlFor={props.name}
    placeholder={placeholder}
    label={label}
    errorText={errorText}
    hasValue={!!props.value}
  >
    <Grid>
      {leftElement && <Grid.Item grow={0} className={style.element}>{leftElement}</Grid.Item>}
      <Grid.Item grow={1}>
        <Input
          {...props}
          className={style[props.multiLine ? 'multiLine' : 'input']}
          validateOnBlur
        />
      </Grid.Item>
      {rightElement && <Grid.Item grow={0} className={style.element}>{rightElement}</Grid.Item>}
    </Grid>
  </FormElement>
);

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  errorText: PropTypes.node,
  label: PropTypes.node,
  /** Element to place left of text input (leading icon) */
  leftElement: PropTypes.node,
  /** Is simple input or textarea */
  multiLine: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.node,
  /** Element to place right of text input (trailing icon) */
  rightElement: PropTypes.node,
  type: PropTypes.string,
  /** Initial value of text field */
  value: PropTypes.string,
};

TextField.defaultProps = {
  className: '',
  errorText: '',
  label: '',
  leftElement: null,
  onChange: noop,
  placeholder: '',
  multiLine: false,
  rightElement: null,
  value: '',
  type: 'text',
};

export default TextField;
