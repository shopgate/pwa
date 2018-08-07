import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    className: PropTypes.string,
    errorText: PropTypes.node,
    hasPlaceholder: PropTypes.bool,
    hasUnderline: PropTypes.bool,
    hasValue: PropTypes.bool,
    isFocused: PropTypes.bool,
    label: PropTypes.node,
    placeholder: PropTypes.node,
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
    return this.isFocused && !this.props.hasValue;
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
    return (
      <div className={`${style.formElement} ${this.props.className}`}>

        {this.props.hasPlaceholder &&
          <Placeholder visible={this.isPlaceholderVisible} placeholder={this.props.placeholder} />
        }

        <Label
          htmlFor={this.props.htmlFor}
          label={this.props.label}
          isFocused={this.props.isFocused}
          isFloating={this.isLabelFloating}
          hasErrorMessage={this.hasErrorMessage}
        />

        {this.props.children}

        {this.props.hasUnderline &&
          <Underline isFocused={this.props.isFocused} hasErrorMessage={this.hasErrorMessage} />
        }
        <ErrorText errorText={this.props.errorText} />
      </div>
    );
  }
}

export default FormElement;
