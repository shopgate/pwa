import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';
import styles from './style';
import transition from './transition';

/**
 * The Ripple component.
 */
class Ripple extends Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    color: PropTypes.oneOf(['dark', 'light']),
    onClick: PropTypes.func,
    origin: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    color: 'dark',
    onClick: () => {},
    origin: null,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.colors = {
      dark: '#000',
      light: '#fff',
    };

    this.state = {
      animating: false,
      offsetX: 0,
      offsetY: 0,
    };
  }

  /**
   * 
   * @param {*} nextState 
   */
  shouldComponentUpdate(nextState) {
    return this.state.animating !== nextState.animating;
  }

  /**
   * 
   */
  get origin() {
    if (!this.props.origin) {
      return {
        left: -(this.size - this.props.size) / 2,
        top: -(this.size - this.props.size) / 2,
      };
    }

    return {
      left: -(this.size / 2) + this.props.origin[0],
      top: -(this.size / 2) + this.props.origin[1],
    };
  }

  /**
   * 
   */
  start = (event) => {
    this.setState({
      animating: true,
      offsetX: event.nativeEvent.offsetX,
      offsetY: event.nativeEvent.offsetY,
    });
  }

  /**
   * 
   */
  stop = () => {
    this.setState({ animating: false }, this.props.onClick);
  }

  /**
   * 
   */
  render() {
    return (
      <div
        aria-hidden
        className={styles.container}
        onClick={this.start}
        style={{
          height: this.props.size,
          width: this.props.size,
        }}
      >
        <Transition
          in={this.state.animating}
          onEntered={this.stop}
          timeout={{
            enter: 500,
            exit: 0,
          }}
        >
          {state => (
            <div
              className={styles.bubble}
              style={{
                background: this.colors[this.props.color],
                height: this.props.size,
                width: this.props.size,
                ...this.origin,
                ...transition[state],
              }}
            />
          )}
        </Transition>
      </div>
    );
  }
}

export default Ripple;
