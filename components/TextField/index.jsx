/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Label from './components/Label';
import Underline from './components/Underline';
import ErrorText from './components/ErrorText';
import Hint from './components/Hint';
import styles from './style';
import FormElement from './components/FormElement/index';

/**
 * A component that provides a styled text field for user input in material design.
 */
class TextField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    errorText: PropTypes.node,
    hintText: PropTypes.node,
    label: PropTypes.node,
    multiLine: PropTypes.bool,
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
    errorText: '',
    setRef: () => {},
    hintText: '',
    label: '',
    multiLine: false,
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
   * @returns {boolean} Whether the label is currently floating.
   */
  get isLabelFloating() {
    return this.isFocused || !!this.props.value;
  }

  /**
   * @returns {boolean} Whether the hint text is currently visible.
   */
  get isHintVisible() {
    return this.isFocused && !this.props.value;
  }

  /**
   * @return {boolean} Whether the error message is set.
   */
  get hasErrorMessage() {
    return !!(this.state.validationError || this.props.errorText);
  }

  /**
   * Renders the text field.
   * @return {JSX}
   */
  render() {
    const styleType = this.props.multiLine ? 'multiLine' : 'input';
    const style = styles.container[styleType];

    return (
      <div className={`${style} ${this.props.className}`}>
        <Hint visible={this.isHintVisible} hintText={this.props.hintText} />
        <Label
          name={this.props.name}
          label={this.props.label}
          isFocused={this.isFocused}
          isFloating={this.isLabelFloating}
          hasErrorMessage={this.hasErrorMessage}
        />
        <FormElement
          id={this.props.name}
          multiLine={this.props.multiLine}
          name={this.props.name}
          setRef={this.props.setRef}
          onFocusChange={this.handleFocusChange}
          onChange={this.handleChange}
          onSanitize={this.props.onSanitize}
          onValidate={this.handleValidate}
          password={this.props.password}
          type={this.props.type}
          value={this.props.value}
        />
        <Underline isFocused={this.isFocused} hasErrorMessage={this.hasErrorMessage} />
        <ErrorText validationError={this.state.validationError} errorText={this.props.errorText} />
      </div>
    );
  }
}

export default TextField;
