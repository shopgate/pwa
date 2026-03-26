import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
 * A component that provides a styled checkbox field.
 * @param {Object} props Props.
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
  const { classes } = useStyles();

  return (
    <FormElement
      className={classNames(className, classes.root, 'checkbox', 'ui-shared__form__checkbox')}
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
          <div className={classNames(classes.labelWrapper, 'label')}>
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
