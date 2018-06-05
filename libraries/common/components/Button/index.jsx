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
    const buttonProps = {
      className: `${this.props.className} ${style}`,
      disabled: this.props.disabled,
      onClick: this.props.disabled ? null : this.props.onClick,
    };

    return buttonProps;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <button data-test-id={this.props.testId} {...this.buttonProps}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
