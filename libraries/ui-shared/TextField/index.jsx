import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    disabled: PropTypes.bool,
    errorText: PropTypes.node,
    hintText: PropTypes.node,
    /* eslint-disable-next-line react/forbid-prop-types */
    inputComponent: PropTypes.any,
    isControlled: PropTypes.bool,
    label: PropTypes.node,
    multiLine: PropTypes.bool,
    onChange: PropTypes.func,
    onFocusChange: PropTypes.func,
    onSanitize: PropTypes.func,
    onValidate: PropTypes.func,
    password: PropTypes.bool,
    required: PropTypes.bool,
    setRef: PropTypes.func,
    showErrorText: PropTypes.bool,
    translateErrorText: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    errorText: '',
    showErrorText: true,
    setRef: () => { },
    hintText: '',
    isControlled: false,
    label: '',
    multiLine: false,
    onChange: () => { },
    onFocusChange: () => { },
    onSanitize: value => value,
    onValidate: () => true,
    required: false,
    password: false,
    translateErrorText: true,
    type: 'text',
    value: '',
    inputComponent: 'input',
    disabled: false,
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
   * @returns {boolean} Whether the text field is currently focused.
   */
  get isFocused() {
    return this.state.isFocused;
  }

  /**
   * @returns {boolean} Whether the label is currently floating.
   */
  get isLabelFloating() {
    // On Firefox empty date inputs always show a placeholder with date pattern
    if (navigator.userAgent.includes('Firefox') && this.props.type === 'date') {
      return true;
    }

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
   * Internal focus event handler.
   * @param {boolean} isFocused Whether the input component is focused.
   */
  handleFocusChange = (isFocused) => {
    this.setState({
      isFocused,
    });
    this.props.onFocusChange(isFocused);
  };

  /**
   * Updates the state if the input value has been changed.
   * @param {string} value The entered text.
   * @param {Object} event The original event object.
   */
  handleChange = (value, event) => {
    this.props.onChange(value, event);
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
  };

  /**
   * Renders the text field.
   * @return {JSX.Element}
   */
  render() {
    const styleType = this.props.multiLine ? 'multiLine' : 'input';
    const style = styles.container[styleType];
    const {
      multiLine,
      className,
      disabled,
      hintText,
      name,
      label,
      setRef,
      onSanitize,
      password,
      type,
      value,
      isControlled,
      inputComponent,
      showErrorText,
      errorText,
      translateErrorText,
      required,
    } = this.props;

    return (
      <div className={classNames(style, className, 'textField', 'ui-shared__text-field', {
        disabled,
      })}
      >
        <Hint visible={this.isHintVisible} hintText={hintText} />
        <Label
          name={name}
          label={label}
          isFocused={this.isFocused}
          isFloating={this.isLabelFloating}
          hasErrorMessage={this.hasErrorMessage}
        />
        <FormElement
          id={name}
          multiLine={multiLine}
          name={name}
          setRef={setRef}
          onFocusChange={this.handleFocusChange}
          onChange={this.handleChange}
          onSanitize={onSanitize}
          onValidate={this.handleValidate}
          password={password}
          type={type}
          value={value}
          isControlled={isControlled}
          inputComponent={inputComponent}
          disabled={disabled}
          required={required}
          attributes={{
            'aria-invalid': !!errorText,
            'aria-describedby': this.hasErrorMessage ? `ariaError-${name}` : null,
          }}
        />

        <Underline isFocused={this.isFocused} hasErrorMessage={this.hasErrorMessage} />
        {showErrorText &&
          <ErrorText
            validationError={this.state.validationError}
            errorText={errorText}
            translate={translateErrorText}
            elementName={name}
          />
        }
      </div>
    );
  }
}

export default hot(TextField);
