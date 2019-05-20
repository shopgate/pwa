import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * A component that takes care of rendering and validation of input fields.
 * This component has no styling and should not be used directly.
 * You may want to use an appropriate form field component from the template instead.
 */
class SimpleInput extends Component {
  static propTypes = {
    /** Additional html attributes by input type */
    attributes: PropTypes.shape(),
    autoComplete: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    disabled: PropTypes.bool,
    id: PropTypes.string,
    isControlled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onFocusChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    onSanitize: PropTypes.func,
    onValidate: PropTypes.func,
    password: PropTypes.bool,
    setRef: PropTypes.func,
    type: PropTypes.string,
    validateOnBlur: PropTypes.bool,
    value: PropTypes.string,
  };

  static defaultProps = {
    attributes: null,
    autoComplete: false,
    autoCorrect: false,
    className: '',
    disabled: false,
    id: null,
    isControlled: false,
    name: null,
    onChange: () => {},
    onFocusChange: () => {},
    onKeyPress: () => {},
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
    // Initially sanitize the value.
    const sanitizedValue = this.props.onSanitize(this.props.value || '');

    this.state = {
      value: sanitizedValue,
      isValid: this.props.onValidate(sanitizedValue, true),
      isFocused: false,
    };
  }

  /**
   * Initially trigger onChange() to set the initial value.
   */
  componentDidMount() {
    const sanitizedValue = this.props.onSanitize(this.props.value || '');
    this.props.onChange(sanitizedValue);
  }

  /**
   * Updates the value of the input field if the props has been modified.
   * @param {Object} nextProps The new properties.
   */
  componentWillReceiveProps(nextProps) {
    /**
     * Only set the state value if the value prop has been changed,
     * otherwise use the current input state.
     */
    const sanitizedValue = this.props.onSanitize(nextProps.value || '');
    if (sanitizedValue !== this.state.value) {
      this.updateValue(sanitizedValue, true);
    }
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
    this.updateValue(sanitizedValue, !this.props.isControlled);

    // Emit an event.
    this.props.onChange(sanitizedValue);
  };

  /**
   * Handles reference passing to callback and assignation.
   * @param {HTMLElement} ref The element
   */
  handleRef(ref) {
    this.ref = ref;
    this.props.setRef(ref);
  }

  /**
   * Updates and validates the internal state value of the input field.
   * @param {string} newValue The new value.
   * @param {boolean} setOwnState Specifies whether or not to update the internal state.
   */
  updateValue(newValue, setOwnState) {
    const newState = {
      value: newValue,
    };

    if (!this.props.validateOnBlur) {
      // Validate while typing.
      newState.isValid = this.props.onValidate(newValue, false);
    }

    // Uncontrolled when setOwnState is true
    if (setOwnState) {
      this.setState(newState);
    }
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      attributes,
      className,
      password,
      onKeyPress,
    } = this.props;
    const type = password ? 'password' : this.props.type;
    const { value } = this.state;
    const autoComplete = this.props.autoComplete ? 'on' : 'off';
    const autoCorrect = this.props.autoCorrect ? 'on' : 'off';

    return (
      <input
        id={this.props.id}
        name={this.props.name}
        ref={ref => this.handleRef(ref)}
        className={className}
        type={type}
        value={value}
        onKeyPress={onKeyPress}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        disabled={this.props.disabled}
        autoCorrect={autoCorrect}
        autoComplete={autoComplete}
        {...attributes}
      />
    );
  }
}

export default SimpleInput;
