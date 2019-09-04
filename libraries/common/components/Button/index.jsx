import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style';

/**
 * The button component.
 */
class Button extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    testId: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    onClick: null,
    testId: 'Button',
  };

  /**
   * Getter for the calculated button props.
   * @returns {Object}
   */
  get buttonProps() {
    const {
      children, testId, className, disabled, onClick, ...props
    } = this.props;

    const buttonProps = {
      className: `${className} ${style}`,
      disabled,
      onClick: disabled ? null : onClick,
      ...props,
    };

    return buttonProps;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      // eslint-disable-next-line react/button-has-type
      <button data-test-id={this.props.testId} {...this.buttonProps}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
