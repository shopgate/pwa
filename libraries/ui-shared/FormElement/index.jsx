import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Label from './components/Label';
import Underline from './components/Underline';
import ErrorText from './components/ErrorText';
import Placeholder from './components/Placeholder';
import style from './style';

/**
 * A component that provides a styled form element in material design.
 */
class FormElement extends Component {
  static propTypes = {
    htmlFor: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    errorText: PropTypes.node,
    hasPlaceholder: PropTypes.bool,
    hasUnderline: PropTypes.bool,
    hasValue: PropTypes.bool,
    isFocused: PropTypes.bool,
    label: PropTypes.node,
    placeholder: PropTypes.node,
    translateErrorText: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    className: '',
    errorText: '',
    placeholder: '',
    label: '',
    isFocused: false,
    hasValue: false,
    hasPlaceholder: true,
    hasUnderline: true,
    translateErrorText: true,
  };

  /**
   * @returns {boolean} Whether the label is currently floating.
   */
  get isLabelFloating() {
    return this.props.isFocused || this.props.hasValue;
  }

  /**
   * @returns {boolean} Whether the hint text is currently visible.
   */
  get isPlaceholderVisible() {
    return !this.props.isFocused && !this.props.hasValue;
  }

  /**
   * @returns {boolean} Whether the hint text is currently visible.
   */
  get hasErrorMessage() {
    return !!this.props.errorText;
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      isFocused, errorText, translateErrorText,
      placeholder, hasPlaceholder, htmlFor, label, className,
    } = this.props;

    return (
      <div className={classNames(
        style.formElement,
        className,
        'formElement'
      )}
      >
        {hasPlaceholder && (placeholder || label) &&
          <Placeholder
            visible={this.isPlaceholderVisible}
            placeholder={placeholder || label}
            aria-hidden
          />
        }

        {label &&
          <Label
            htmlFor={htmlFor}
            label={label}
            isFocused={isFocused}
            isFloating={this.isLabelFloating}
            hasErrorMessage={this.hasErrorMessage}
          />
        }

        {this.props.children}

        {this.props.hasUnderline &&
          <Underline isFocused={isFocused} hasErrorMessage={this.hasErrorMessage} />
        }
        {errorText && <ErrorText errorText={errorText} translate={translateErrorText} />}
      </div>
    );
  }
}

export default FormElement;
