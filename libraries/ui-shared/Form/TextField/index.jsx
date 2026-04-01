import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import Grid from '@shopgate/pwa-common/components/Grid';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import { makeStyles } from '@shopgate/engage/styles';

/**
 * Default handler when an optional callback is omitted.
 * @returns {void}
 */
const noop = () => {};

const bluredDateSelector = 'input[type="date"]:in-range:not(:focus)';
const webkitDateFields = [
  '::-webkit-datetime-edit-year-field',
  '::-webkit-datetime-edit-month-field',
  '::-webkit-datetime-edit-day-field',
  '::-webkit-datetime-edit-text',
].map(suffix => `${bluredDateSelector}${suffix}`).join(', ');

const useStyles = makeStyles()({
  container: {
    '& input[type="date"]': {
      minHeight: '1.3rem',
      appearance: 'none',
      paddingLeft: 0,
      marginLeft: 0,
    },
    [`& ${webkitDateFields}`]: {
      padding: 0,
      color: 'transparent',
    },
  },
  input: {
    position: 'relative',
    padding: 0,
    width: '100%',
    marginTop: 24,
    outline: 0,
    fontSize: 16,
    lineHeight: '19px',
  },
  multiLine: {
    position: 'relative',
    marginTop: 24,
    marginBottom: 3,
    padding: 0,
    width: '100%',
    outline: 0,
    height: 19,
    minHeight: 19,
    lineHeight: '19px',
    verticalAlign: 'top',
  },
  element: {
    marginTop: 16,
    display: 'flex',
    alignItems: 'flex-end',
  },
  leftOffset: {
    marginLeft: 2,
  },
});

/**
 * TextField component (form wrapper with leading/trailing elements).
 * @param {Object} allProps Props.
 * @returns {JSX.Element}
 */
const TextField = (allProps) => {
  const {
    className,
    placeholder,
    label,
    errorText,
    leftElement,
    rightElement,
    hasUnderline,
    onFocusChange,
    ...props
  } = allProps;

  const { classes, cx } = useStyles();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocusChange = useCallback((focused) => {
    setIsFocused(focused);
    onFocusChange(focused);
  }, [onFocusChange]);

  const inputTypeClass = props.multiLine ? classes.multiLine : classes.input;

  return (
    <FormElement
      className={cx(className, 'ui-shared__form__text-field')}
      htmlFor={props.name}
      placeholder={placeholder}
      label={label}
      errorText={errorText}
      hasLeftElement={!!leftElement}
      hasUnderline={hasUnderline}
      hasValue={!!props.value}
      isFocused={isFocused}
    >
      <Grid>
        {leftElement && <Grid.Item grow={0} className={classes.element}>{leftElement}</Grid.Item>}
        <Grid.Item grow={1} className={classes.container}>
          <Input
            {...props}
            onFocusChange={handleFocusChange}
            className={cx(
              inputTypeClass,
              leftElement && classes.leftOffset
            )}
            validateOnBlur
          />
        </Grid.Item>
        {rightElement && <Grid.Item grow={0} className={classes.element}>{rightElement}</Grid.Item>}
      </Grid>
    </FormElement>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  attributes: PropTypes.shape(),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  errorText: PropTypes.node,
  hasUnderline: PropTypes.bool,
  label: PropTypes.node,
  leftElement: PropTypes.node,
  maxLength: PropTypes.string,
  multiLine: PropTypes.bool,
  onChange: PropTypes.func,
  onFocusChange: PropTypes.func,
  placeholder: PropTypes.node,
  rightElement: PropTypes.node,
  type: PropTypes.string,
  value: PropTypes.string,
};

TextField.defaultProps = {
  attributes: null,
  className: '',
  errorText: '',
  hasUnderline: true,
  label: '',
  leftElement: null,
  onChange: noop,
  onFocusChange: noop,
  placeholder: '',
  multiLine: false,
  rightElement: null,
  value: '',
  type: 'text',
  maxLength: '',
};

export default TextField;
