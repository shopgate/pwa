import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Label from './components/Label';
import Underline from './components/Underline';
import ErrorText from './components/ErrorText';
import Placeholder from './components/Placeholder';

const useStyles = makeStyles()(theme => ({
  formElement: {
    position: 'relative',
    paddingBottom: theme.spacing(2),
    width: '100%',
  },
}));

/**
 * A component that provides a styled form element in material design.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const FormElement = ({
  children,
  className,
  disabled,
  errorText,
  hasLeftElement,
  hasPlaceholder,
  hasUnderline,
  hasValue,
  htmlFor,
  isFocused,
  label,
  labelStatic,
  placeholder,
  showErrorText,
  translateErrorText,
}) => {
  const { classes, cx } = useStyles();

  const isLabelFloating = !labelStatic && (isFocused || hasValue);
  const isPlaceholderVisible = !isFocused && !hasValue;
  const hasErrorMessage = !!errorText;

  return (
    <div className={cx(
      classes.formElement,
      className,
      'formElement',
      'ui-shared__form-element',
      {
        disabled,
      }
    )}
    >
      {hasPlaceholder && (placeholder || label) && (
        <Placeholder
          visible={isPlaceholderVisible}
          placeholder={placeholder || label}
          hasLeftElement={hasLeftElement}
          aria-hidden
        />
      )}

      {label && (
        <Label
          htmlFor={htmlFor}
          label={label}
          labelStatic={labelStatic}
          isFocused={isFocused}
          isFloating={isLabelFloating}
          hasErrorMessage={hasErrorMessage}
        />
      )}

      {children}

      {hasUnderline && (
        <Underline isFocused={isFocused} hasErrorMessage={hasErrorMessage} />
      )}
      {errorText && showErrorText && (
        <ErrorText
          errorText={errorText}
          translate={translateErrorText}
          elementName={htmlFor}
        />
      )}
    </div>
  );
};

FormElement.propTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  disabled: PropTypes.bool,
  errorText: PropTypes.node,
  hasLeftElement: PropTypes.bool,
  hasPlaceholder: PropTypes.bool,
  hasUnderline: PropTypes.bool,
  hasValue: PropTypes.bool,
  htmlFor: PropTypes.string,
  isFocused: PropTypes.bool,
  label: PropTypes.node,
  labelStatic: PropTypes.bool,
  placeholder: PropTypes.node,
  showErrorText: PropTypes.bool,
  translateErrorText: PropTypes.bool,
};

FormElement.defaultProps = {
  children: null,
  className: '',
  errorText: '',
  placeholder: '',
  htmlFor: '',
  label: '',
  labelStatic: false,
  isFocused: false,
  hasLeftElement: false,
  hasValue: false,
  hasPlaceholder: true,
  hasUnderline: true,
  translateErrorText: true,
  disabled: false,
  showErrorText: true,
};

export default FormElement;
