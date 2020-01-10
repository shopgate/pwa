import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import style from './style';

/**
 * RadioGroup component.
 */
class RadioGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    /* Flex direction for radio group */
    direction: PropTypes.string,
    errorText: PropTypes.string,
    isControlled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    translateErrorText: PropTypes.bool,
    /* Radio group value */
    value: PropTypes.string,
  }

  static defaultProps = {
    onChange: () => { },
    children: null,
    direction: 'column',
    errorText: '',
    isControlled: false,
    label: '',
    translateErrorText: true,
    value: null,
  }

  /**
   * @param {Object} props The component props.
   * @param {Object} state The component state.
   * @returns {Object}
   */
  static getDerivedStateFromProps(props, state) {
    if (props.isControlled && state.value !== props.value) {
      return {
        value: props.value,
      };
    }

    return null;
  }

  /**
   * Initializes the component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  /**
   * @param {string} event click from radio element
   */
  handleChange = ({ target: { name } }) => {
    if (!this.props.isControlled) {
      this.setState({ value: name });
    }
    this.props.onChange(name);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      children, label, errorText, direction, name, translateErrorText,
    } = this.props;

    return (
      <FormElement
        label={label}
        errorText={errorText}
        translateErrorText={translateErrorText}
        htmlFor="none"
        hasUnderline={false}
        hasValue
      >
        <div className={style.container(direction)}>
          {Children.map(children, child => cloneElement(child, {
            key: `${name}_${child.props.name}`,
            checked: this.state.value === child.props.name,
            onChange: this.handleChange,
          }))
          }
        </div>
      </FormElement>
    );
  }
}

export default RadioGroup;
