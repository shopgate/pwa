import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ripple from '../Ripple';
import styles from './style';

/**
 * The Button component.
 */
class Button extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.shape(),
    textColor: PropTypes.string,
  }

  static defaultProps = {
    color: '#3f51b5',
    disabled: false,
    style: {},
    textColor: '#fff',
  }

  /**
   * @param {*} props The component props.
   */
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
  }

  /**
   * @param {MouseEvent} event The mouse event.
   */
  handleClick = (event) => {
    this.props.onClick(event);
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { color: background, disabled, textColor: color } = this.props;
    const ButtonComponent = React.forwardRef((props, ref) => (
      <button
        className={styles}
        ref={ref}
        style={{
          background,
          color,
          ...this.props.style,
          ...disabled && { pointerEvents: 'none' },
        }}
        type="button"
      >
        <Ripple
          color="light"
          onClick={props.onClick}
          parent={ref}
        />
        {props.children}
      </button>
    ));

    return (
      <ButtonComponent
        onClick={this.handleClick}
        ref={this.buttonRef}
      >
        {this.props.children}
      </ButtonComponent>
    );
  }
}

export default Button;
