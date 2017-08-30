/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input from '@shopgate/pwa-common/components/Input';
import I18n from '@shopgate/pwa-common/components/I18n';
import colors from 'Styles/colors';
import styles from './style';

/**
 * Gets the style classes for the label.
 * @param {boolean} focused Whether the input field is focused.
 * @param {boolean} floating Whether the label is floating.
 * @param {boolean} error Whether the input field shows an error message.
 * @return {string} The style classes.
 */
const getLabelStyles = (focused = false, floating = false, error = false) => (
  classNames(
    styles.label,
    {
      [styles.labelFloating]: floating,
      [styles.labelRegular]: !focused,
      [styles.labelFocus]: !error && focused,
      [styles.labelError]: error && focused,
    }
  )
);

/**
 * Gets the style classes for the underline element.
 * @param {boolean} visible Whether the hint is visible.
 * @return {string} The style classes.
 */
const getHintStyles = (visible = false) => (
  classNames(
    styles.hint,
    {
      [styles.hintInactive]: !visible,
    }
  )
);

/**
 * A component that provides a styled text field for user input in material design.
 */
class TextField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    colorError: PropTypes.string,
    colorFocus: PropTypes.string,
    errorText: PropTypes.node,
    hintText: PropTypes.node,
    label: PropTypes.node,
    onChange: PropTypes.func,
    onSanitize: PropTypes.func,
    onValidate: PropTypes.func,
    password: PropTypes.bool,
    setRef: PropTypes.func,
    type: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    colorFocus: colors.primary,
    colorError: colors.error,
    errorText: '',
    setRef: () => {},
    hintText: '',
    label: '',
    onChange: () => {},
    onSanitize: value => value,
    onValidate: () => true,
    password: false,
    type: 'text',
    value: '',
  };

  /**
   * Creates a new text field component.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      value: '',
      validationError: null,
    };
  }

  /**
   * Internal focus event handler.
   * @param {boolean} isFocused Whether the input component is focused.
   */
  handleFocusChange = (isFocused) => {
    this.setState({
      isFocused,
    });
  };

  /**
   * Updates the state if the input value has been changed.
   * @param {string} value The entered text.
   */
  handleChange = (value) => {
    this.setState({ value });
    this.props.onChange(value);
  };

  /**
   * Updates the validation error text if required.
   * @param {string} value The entered text.
   * @param {boolean} isInitial Whether this is the initial value of the input field.
   * @return {boolean} Whether the validation was successful.
   */
  handleValidate = (value, isInitial) => {
    const validationError = this.props.onValidate(value);

    if (validationError !== true && validationError) {
      /**
       * An error message was returned by the validation callback. Update the state.
       * Because the validation is performed when the component is constructed, we need to make
       * sure we're not calling setState() in this situation.
       */
      if (!isInitial) {
        this.setState({ validationError });
      } else {
        this.state.validationError = validationError;
      }
    } else if (this.state.validationError) {
      // There was no error, clear the state variable.
      this.setState({ validationError: null });
    }

    // Forward the boolean result to the input field.
    return validationError === true;
  }

  /**
   * @returns {boolean} Whether the text field is currently focused.
   */
  get isFocused() {
    return this.state.isFocused;
  }

  /**
   * @returns {string} The current value of the input field.
   */
  get value() {
    return this.state.value;
  }

  /**
   * @returns {boolean} Whether the label is currently floating.
   */
  get isLabelFloating() {
    return this.isFocused || this.value;
  }

  /**
   * @returns {boolean} Whether the hint text is currently visible.
   */
  get isHintVisible() {
    return this.isFocused && !this.value;
  }

  /**
   * @return {boolean} Whether the error message is set.
   */
  get hasErrorMessage() {
    return !!(this.state.validationError || this.props.errorText);
  }

  /**
   * Returns the label inline style.
   * @return {Object|null}
   */
  get labelStyle() {
    if (this.isFocused || this.isLabelFloating) {
      return {
        color: this.props.colorFocus,
      };
    }

    return null;
  }

  /**
   * Returns the underline style.
   * @return {Object}
   */
  get underlineStyle() {
    return {
      borderBottomColor: this.hasErrorMessage ? this.props.colorError : this.props.colorFocus,
      ...(!this.isFocused && !this.hasErrorMessage) && { transform: 'scale3d(0,1,1)' },
    };
  }

  /**
   * Renders the hint element.
   * @param {boolean} isVisible Whether to show the hint element.
   * @return {JSX}
   */
  renderHintElement = isVisible => (
    <div className={getHintStyles(isVisible)}>
      <I18n.Text string={this.props.hintText} />
    </div>
  );

  /**
   * Renders the label element.
   * @param {boolean} isFocused Whether the input component is focused.
   * @param {boolean} isFloating Whether the label is floating.
   * @param {boolean} hasErrorMessage Whether the input field has an active error message.
   * @return {JSX}
   */
  renderLabelElement = (isFocused, isFloating, hasErrorMessage) => (
    <label
      htmlFor={this.props.name}
      className={getLabelStyles(isFocused, isFloating, hasErrorMessage)}
      style={this.labelStyle}
    >
      <I18n.Text string={this.props.label} />
    </label>
  );

  /**
   * Renders the error element.
   * @return {JSX}
   */
  renderErrorElement = () => (
    <div className={styles.error}>
      <I18n.Text string={this.state.validationError || this.props.errorText} />
    </div>
  );

  /**
   * Renders the input field.
   * @return {JSX}
   */
  renderInputField = () => (
    <Input
      id={this.props.name}
      name={this.props.name}
      className={styles.input}
      setRef={this.props.setRef}
      onFocusChange={this.handleFocusChange}
      onChange={this.handleChange}
      onSanitize={this.props.onSanitize}
      onValidate={this.handleValidate}
      password={this.props.password}
      type={this.props.type}
      value={this.props.value}
      validateOnBlur
    />
  );

  /**
   * Renders the underline element.
   * @return {JSX}
   */
  renderUnderline = () => (
    <div className={styles.underlineWrapper}>
      <div className={styles.underline} style={this.underlineStyle} />
    </div>
  );

  /**
   * Renders the text field.
   * @return {JSX}
   */
  render() {
    return (
      <div className={`${styles.container} ${this.props.className}`}>
        {this.renderHintElement(this.isHintVisible)}
        {this.renderLabelElement(this.isFocused, this.isLabelFloating, this.hasErrorMessage)}
        {this.renderInputField()}
        {this.renderUnderline(this.isFocused, this.hasErrorMessage)}
        {this.renderErrorElement()}
      </div>
    );
  }
}

export default TextField;
