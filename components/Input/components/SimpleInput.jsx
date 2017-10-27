/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * A component that takes care of rendering and validation of input fields.
 * This component has no styling and should not be used directly.
 * You may want to use an appropriate form field component from the template instead.
 */
class Input extends Component {

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    multiLine: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onFocusChange: PropTypes.func,
    onSanitize: PropTypes.func,
    onValidate: PropTypes.func,
    password: PropTypes.bool,
    setRef: PropTypes.func,
    type: PropTypes.string,
    validateOnBlur: PropTypes.bool,
    value: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    id: null,
    multiLine: false,
    name: null,
    onChange: () => {},
    onFocusChange: () => {},
    onSanitize: value => value,
    onValidate: () => true,
    password: false,
    setRef: () => {},
    type: 'text',
    validateOnBlur: true,
    value: '',
  };

  /**
   * Creates a new input component.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);
    this.ref = null;
    // Initially sanitize the value. If it's multiline, first render must be empty.
    const initialValue = this.props.multiLine ? '' : this.props.value;
    const sanitizedValue = this.props.onSanitize(initialValue || '');

    this.state = {
      value: sanitizedValue,
      isValid: this.props.onValidate(sanitizedValue, true),
      isFocused: false,
    };
  }

  /**
   * If multiline, set real value and trigger second render.
   * Initially trigger onChange() to set the initial value.
   */
  componentDidMount() {
    const sanitizedValue = this.props.onSanitize(this.props.value || '');
    if (this.props.multiLine) {
      this.changeState({
        value: sanitizedValue,
        isValid: this.props.onValidate(sanitizedValue, true),
        isFocused: false,
      });
    }
    this.props.onChange(sanitizedValue);
  }

  /**
   * Updates the value of the input field if the props has been modified.
   * @param {Object} nextProps The new properties.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      /**
       * Only set the state value if the value prop has been changed,
       * otherwise use the current input state.
       */
      const sanitizedValue = this.props.onSanitize(nextProps.value || '');
      this.updateValue(sanitizedValue);
    }
  }

  /**
   * Adjusts the element height if the component is set to be multiline.
   */
  componentDidUpdate() {
    if (this.props.multiLine) {
      this.adjustHeight();
    }
  }
  /**
   * Sets an initial height of the multiline HTMLElement.
   */
  setBaseHeight = () => {
    if (this.baseHeight !== null) {
      return;
    }
    this.baseHeight = this.ref.clientHeight;
  };
  /**
   * Additional callback to avoid eslint complain.
   * Secondary render is needed here because for first initial render
   * the textarea should be empty to measure the base client height.
   *
   * @param {Object} newState New state
   */
  changeState(newState) {
    this.setState(newState);
  }
  /**
   * Internal focus event handler.
   */
  handleFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocusChange(true);
  };

  /**
   * Internal blur event handler.
   */
  handleBlur = () => {
    const newState = {
      isFocused: false,
    };

    if (this.props.validateOnBlur) {
      // Validate the value.
      newState.isValid = this.props.onValidate(this.value, false);
    }

    this.setState(newState);

    this.props.onFocusChange(false);
  };
  /**
   * Internal change event handler.
   * @param {Object} event The event object.
   */
  handleChange = (event) => {
    // Sanitize the input value.
    const sanitizedValue = this.props.onSanitize(event.target.value || '');

    // Update the state.
    this.updateValue(sanitizedValue);

    // Emit an event.
    this.props.onChange(sanitizedValue);
  };

  /**
   * Handles reference passing to callback and assignation.
   * @param {HTMLElement} ref The element
   */
  handleRef = (ref) => {
    this.ref = ref;
    this.props.setRef(ref);
    if (this.props.multiLine) {
      this.setBaseHeight();
    }
  };

  /**
   * Auto-expands the textarea.
   */
  adjustHeight() {
    if (!(this.ref instanceof HTMLElement)) {
      console.error('Ref is not an HTMLElement');
      return;
    }

    this.ref.style.height = `${this.baseHeight}px`;
    this.ref.style.height = `${this.ref.scrollHeight}px`;
  }

  /**
   * Updates and validates the internal state value of the input field.
   * @param {string} newValue The new value.
   */
  updateValue(newValue) {
    const newState = {
      value: newValue,
    };

    if (!this.props.validateOnBlur) {
      // Validate while typing.
      newState.isValid = this.props.onValidate(newValue, false);
    }

    this.setState(newState);
  }

  /**
   * @returns {boolean} Whether the current value of the input field is valid.
   */
  get isValid() {
    return this.state.isValid;
  }

  /**
   * @return {boolean} Whether the input field is focused.
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
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { className, password } = this.props;
    const type = password ? 'password' : this.props.type;
    const { value } = this.state;

    if (this.props.multiLine) {
      return (
        <textarea
          id={this.props.id}
          name={this.props.name}
          ref={this.handleRef}
          className={className}
          type={type}
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          disabled={this.props.disabled}
        />
      );
    }
    return (
      <input
        id={this.props.id}
        name={this.props.name}
        ref={this.handleRef}
        className={className}
        type={type}
        value={value}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        disabled={this.props.disabled}
      />
    );
  }
}

export default Input;
