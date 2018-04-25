import React, { Component } from 'react';
import Ripple from '../Ripple';
import styles from './style';

/**
 * 
 */
class Button extends Component {
  /**
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props);

    this.buttonRef = React.createRef();
  }

  /**
   * 
   */
  get diameter() {
    const current = this.buttonRef.current ? this.buttonRef.current : {};
    const { clientHeight = 0, clientWidth = 0 } = current;
    return clientWidth;

    return Math.sqrt((clientHeight ** 2) + (clientWidth ** 2));
  }

  handleClick = () => {
    console.warn('Click!');
  }

  /**
   * 
   */
  render() {
    const ButtonComponent = React.forwardRef((props, ref) => {
      return (
        <button className={styles} ref={ref}>
          <Ripple size={this.diameter} onClick={props.onClick} parent={ref} />
          {props.children}
        </button>
      );
    });

    return <ButtonComponent ref={this.buttonRef} onClick={this.handleClick}>hello</ButtonComponent>;
  }
}

export default Button;
