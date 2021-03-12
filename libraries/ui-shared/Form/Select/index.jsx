import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Chevron from '../../icons/ChevronIcon';
import FormElement from '../../FormElement';
import styles from './style';

/**
 * A component that provides a styled select for user input in material design.
 */
class Select extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    errorText: PropTypes.node,
    isControlled: PropTypes.bool,
    label: PropTypes.node,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    options: PropTypes.shape(),
    placeholder: PropTypes.node,
    size: PropTypes.number,
    translateErrorText: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  };

  static defaultProps = {
    className: '',
    errorText: '',
    isControlled: false,
    placeholder: '',
    label: '',
    onChange: () => {},
    options: {},
    translateErrorText: true,
    size: null,
    value: '',
    disabled: false,
    multiple: false,
  };

  /**
   * Creates a new text field component.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      isFocused: false,
    };
  }

  /**
   * Update state with new props.
   * @param {Object} nextProps The new props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  /**
   * @param {string} value The entered text.
   */
  handleChange = ({ target }) => {
    const { multiple } = this.props;

    let { value } = target;
    if (multiple) {
      value = Array.from(target.selectedOptions, option => option.value);
    }

    if (!this.props.isControlled) {
      this.setState({ value });
    }
    this.props.onChange(value);
  };

  /**
   * @param {boolean} isFocused focused
   */
  handleFocusChange = (isFocused) => {
    this.setState({ isFocused });
  };

  /**
   * @return {JSX}
   */
  render() {
    const {
      name, options, translateErrorText, disabled, multiple, size,
    } = this.props;
    return (
      <FormElement
        className={this.props.className}
        placeholder={this.props.placeholder}
        htmlFor={name}
        label={this.props.label}
        errorText={this.props.errorText}
        translateErrorText={translateErrorText}
        isFocused={this.state.isFocused}
        hasValue={!!this.state.value || !!options['']}
        hasPlaceholder={!disabled || this.state.value !== ''}
        disabled={disabled}
      >
        <select
          id={this.props.name}
          name={this.props.name}
          onChange={this.handleChange}
          onFocus={() => this.handleFocusChange(true)}
          onBlur={() => this.handleFocusChange(false)}
          value={this.state.value}
          className={classNames(styles.select, 'select')}
          disabled={disabled}
          {...multiple && {
            multiple,
            size,
          }}
        >
          {
            Object.keys(options).map(key => (
              <option className="option" value={key} key={`${name}_${key}`}>{options[key]}</option>
            ))
          }
        </select>
        <Chevron className={styles.chevron} />
      </FormElement>
    );
  }
}

export default Select;
