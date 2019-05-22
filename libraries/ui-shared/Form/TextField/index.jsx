import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '@shopgate/pwa-common/components/Input';
import Grid from '@shopgate/pwa-common/components/Grid';
import FormElement from '@shopgate/pwa-ui-shared/FormElement';
import style from './style';

/**
 * No operational
 */
const noop = () => {};

/**
 * TextField component
 */
class TextField extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    attributes: PropTypes.shape(),
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape(),
    ]),
    errorText: PropTypes.node,
    hasUnderline: PropTypes.bool,
    label: PropTypes.node,
    /** Element to place left of text input (leading icon) */
    leftElement: PropTypes.node,
    /** Is simple input or textarea */
    multiLine: PropTypes.bool,
    onChange: PropTypes.func,
    placeholder: PropTypes.node,
    /** Element to place right of text input (trailing icon) */
    rightElement: PropTypes.node,
    type: PropTypes.string,
    /** Initial value of text field */
    value: PropTypes.string,
  };

  static defaultProps = {
    attributes: null,
    className: '',
    errorText: '',
    hasUnderline: true,
    label: '',
    leftElement: null,
    onChange: noop,
    placeholder: '',
    multiLine: false,
    rightElement: null,
    value: '',
    type: 'text',
  };

  /**
   * Creates a new text field component.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
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
   * Renders the text field.
   * @return {JSX}
   */
  render() {
    const {
      className, placeholder, label, errorText, leftElement, rightElement,
      hasUnderline, ...props
    } = this.props;

    return (
      <FormElement
        className={className}
        htmlFor={props.name}
        placeholder={placeholder}
        label={label}
        errorText={errorText}
        hasUnderline={hasUnderline}
        hasValue={!!props.value}
        isFocused={this.state.isFocused}
      >
        <Grid>
          {leftElement && <Grid.Item grow={0} className={style.element}>{leftElement}</Grid.Item>}
          <Grid.Item grow={1} className={style.container}>
            <Input
              {...props}
              onFocusChange={this.handleFocusChange}
              className={style[props.multiLine ? 'multiLine' : 'input']}
              validateOnBlur
            />
          </Grid.Item>
          {rightElement && <Grid.Item grow={0} className={style.element}>{rightElement}</Grid.Item>}
        </Grid>
      </FormElement>
    );
  }
}

export default TextField;
