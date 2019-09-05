import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormElement from '../../FormElement';
import styles from './style';

/**
 * A component that provides a styled select for user input in material design.
 */
class Select extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    errorText: PropTypes.node,
    isControlled: PropTypes.bool,
    label: PropTypes.node,
    onChange: PropTypes.func,
    options: PropTypes.shape(),
    placeholder: PropTypes.node,
    translateErrorText: PropTypes.bool,
    value: PropTypes.string,
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
    value: '',
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
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  /**
   * @param {string} value The entered text.
   */
  handleChange = ({ target }) => {
    if (!this.props.isControlled) {
      this.setState({ value: target.value });
    }
    this.props.onChange(target.value);
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
    const { name, options, translateErrorText } = this.props;
    return (
      <FormElement
        className={this.props.className}
        placeholder={this.props.placeholder}
        htmlFor={name}
        label={this.props.label}
        errorText={this.props.errorText}
        translateErrorText={translateErrorText}
        isFocused={this.state.isFocused}
        hasValue={!!this.state.value}
      >
        <select
          id={this.props.name}
          name={this.props.name}
          onChange={this.handleChange}
          onFocus={() => this.handleFocusChange(true)}
          onBlur={() => this.handleFocusChange(false)}
          value={this.state.value}
          className={styles.select}
        >
          {
            Object.keys(options).map(key => (
              <option value={key} key={`${name}_${key}`}>{options[key]}</option>
            ))
          }
        </select>
      </FormElement>
    );
  }
}

export default Select;
