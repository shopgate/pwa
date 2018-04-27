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
    parent: PropTypes.element.isRequired,
    color: PropTypes.oneOf(['dark', 'light']),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    color: 'dark',
    onClick: () => {},
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
   * @param {*} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextState) {
    return this.state.animating !== nextState.animating;
  }

  /**
   * Get the bubble size.
   */
  get bubbleSize() {
    const { clientHeight, clientWidth } = this.props.parent.current;

    // Get the offset relative to the center and the MouseEvent origin.
    const offsetX = this.center.x - (this.center.x - this.origin.left);
    const offsetY = this.center.y - (this.center.y - this.origin.top);

    // Calculate the distance from the center to the MouseEvent origin.
    const offset = Math.sqrt((offsetX ** 2) + (offsetY ** 2));

    // Return the center offset plus the diameter of the container.
    return offset + Math.sqrt((clientHeight ** 2) + (clientWidth ** 2));
  }

  /**
   * Get the origin point of the bubble.
   */
  get bubbleOrigin() {
    const radius = this.bubbleSize / 2;
    return {
      left: this.state.offsetX - radius,
      top: this.state.offsetY - radius,
    };
  }

  /**
   * Get the center of the parent element.
   */
  get center() {
    const { clientHeight, clientWidth } = this.props.parent.current;
    return {
      x: clientWidth / 2,
      y: clientHeight / 2,
    };
  }

  /**
   * Get the color.
   */
  get color() {
    return this.colors[this.props.color];
  }

  /**
   * Get the origin point of the container.
   */
  get origin() {
    const radius = this.size / 2;
    return {
      left: this.state.offsetX - radius,
      top: this.state.offsetY - radius,
    };
  }

  /**
   * Get the size of the container.
   */
  get size() {
    const { clientHeight, clientWidth } = this.props.parent.current;
    return Math.max(clientHeight, clientWidth);
  }

  /**
   * Start a ripple.
   * @param {MouseEvent} event The mouse event.
   */
  start = (event) => {
    if (this.state.animating) {
      return;
    }

    this.setState({
      animating: true,
      offsetX: event.nativeEvent.offsetX,
      offsetY: event.nativeEvent.offsetY,
    });
  }

  /**
   * Finish a ripple.
   */
  finish = () => {
    this.setState({ animating: false }, this.props.onClick);
  }

  /**
   * @returns {JSX}
   */
  render() {
    if (!this.props.parent.current) {
      return null;
    }

    return (
      <div
        aria-hidden
        className={styles.container}
        onClick={this.start}
        style={{
          height: this.size,
          width: this.size,
        }}
      >
        <Transition
          in={this.state.animating}
          onEntered={this.finish}
          timeout={375}
        >
          {state => (
            <div
              className={styles.bubble}
              style={{
                background: this.color,
                height: this.bubbleSize,
                width: this.bubbleSize,
                ...this.bubbleOrigin,
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
