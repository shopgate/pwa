import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import UICheckbox from '@shopgate/pwa-ui-shared/Checkbox';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    marginLeft: -2,
    cursor: 'pointer',
    '& svg': {
      float: 'left',
    },
  },
  label: {
    lineHeight: 1.6,
  },
  labelWrapper: {
    marginLeft: theme.spacing(4),
  },
  checked: {
    color: 'var(--color-primary)',
  },
}));

/**
 * @typedef {Object} Props
 * @property {string} label Label for the checkbox
 * @property {string} name Name for the form element that's used as "htmlFor" attribute to create
 * a connection between label and checkbox elements.
 * @property {string} [checkboxClassName] Class name for the underlying Checkbox component
 * @property {string} [className] Class name for the underlying FormElement component
 * @property {boolean} [defaultChecked] Whether the checkbox is checked by default
 * @property {boolean} [disabled] Whether the checkbox is disabled (default `false`)
 * @property {string} [errorText] An error text for the form element
 * @property {boolean} [showErrorText] Whether to show the error text when present (default `true`)
 * @property {boolean} [translateErrorText] Whether `errorText` is a translation key
 * @property {Function} [onChange] Change handler for the checkbox
 */

/**
 * A component that provides a styled checkbox field.
 * @extends {React.Component<Props>}
 * @returns {JSX.Element}
 */
const Checkbox = ({
  name,
  label,
  onChange,
  className,
  errorText,
  translateErrorText,
  showErrorText,
  checkboxClassName,
  ...restProps
}) => {
  const { classes, cx } = useStyles();

  return (
    <FormElement
      className={cx(className, classes.root, 'checkbox', 'ui-shared__form__checkbox')}
      htmlFor={name}
      errorText={errorText}
      translateErrorText={translateErrorText}
      hasUnderline={false}
      hasPlaceholder={false}
      disabled={restProps.disabled}
      showErrorText={showErrorText}
    >
      <UICheckbox
        {...restProps}
        className={checkboxClassName}
        name={name}
        onCheck={onChange}
        checkedClassName={`${className} ${classes.checked}`}
        unCheckedClassName={className}
        labelPosition="right"
        label={typeof label === 'string' ? (
          <div className={cx(classes.labelWrapper, 'label')}>
            <I18n.Text className={classes.label} string={label} />
          </div>
        ) : label}
      />
    </FormElement>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  checkboxClassName: PropTypes.string,
  className: PropTypes.string,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  errorText: PropTypes.node,
  label: PropTypes.node,
  onChange: PropTypes.func,
  showErrorText: PropTypes.bool,
  translateErrorText: PropTypes.bool,
};

Checkbox.defaultProps = {
  className: '',
  checkboxClassName: undefined,
  defaultChecked: undefined,
  errorText: '',
  label: '',
  onChange: () => {},
  translateErrorText: true,
  disabled: false,
  showErrorText: true,
};

export default Checkbox;
