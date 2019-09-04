import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import clamp from 'lodash/clamp';
import { shift } from '@shopgate/pwa-common/helpers/data';
import { getOffset } from '@shopgate/pwa-common/helpers/dom';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import RippleAnimation from './components/RippleAnimation';
import style from './style';

/**
 * The ripple component.
 */
class Ripple extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    fill: PropTypes.bool,
    onClick: PropTypes.func,
    onComplete: PropTypes.func,
    overflow: PropTypes.bool,
    size: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    color: themeConfig.colors.dark,
    disabled: false,
    fill: false,
    onClick: () => {},
    onComplete: () => {},
    overflow: false,
    size: null,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      ripples: [],
      nextKey: 0,
      hasRipples: false,
    };

    this.duration = 500;
    this.ignoreNextMouseDown = false;
    this.mounted = false;
    this.offset = null;
    this.position = null;
    this.rootNode = null;
    this.style = null;
  }

  /**
   * Sets the `mounted` flag to true.
   */
  componentDidMount() {
    const { fill } = this.props;

    // Reference to Ripple container (for now and later).
    this.rootNode = findDOMNode(this); // eslint-disable-line react/no-find-dom-node

    // Initially set the position values to be in the middle of the element.
    // If the Ripple's starting point has to follow the user's touch
    // Location then this is checked later.
    this.position = {
      x: this.rootNode.offsetWidth / 2,
      y: this.rootNode.offsetHeight / 2,
    };

    // Determine the duration based on the size of the ripple.
    this.duration = clamp(
      Math.round((Math.log(this.rippleSize) * 100) - (fill ? -75 : 50)),
      0,
      10000
    );

    // Set the `mounted` flag to true.
    this.mounted = true;

    // If the Ripple is not allowed to overflow then apply some styles to the parent container.
    this.style = (!this.props.overflow) ? {
      overflow: 'hidden',
      position: 'relative',
    } : null;
  }

  /**
   * Sets the `mounted` flag to false
   */
  componentWillUnmount() {
    this.mounted = false;
  }

  /**
   * Calculate the size of the ripple.
   * @returns {number}
   */
  get rippleSize() {
    if (this.props.size) {
      if (this.props.fill) {
        return this.props.size * 2;
      }

      return this.props.size;
    }

    /**
     * We want the Ripple to fill the element. We set the diameter of the Ripple
     * to double the distance of the opposing corners of the node. That way the Ripple
     * will reach the furthest away corner if you click at a corner.
     */
    if (this.props.fill) {
      return Math.sqrt((this.rootNode.offsetWidth ** 2) + (this.rootNode.offsetHeight ** 2)) * 2;
    }

    // Otherwise we set the size to be the smaller of the element's height and width.
    return Math.min(this.rootNode.offsetWidth, this.rootNode.offsetHeight);
  }

  /**
   * Calculates the ripple position from the event.
   * @param {Object} event The event object.
   * @returns {Object} An object containing x and y values for the ripple.
   */
  getRipplePosition(event) {
    // If the Ripple is to fill the element then we should set the
    // Starting position to be where the user clicked within that element.
    if (this.props.fill) {
      // Determine if event is a touch event.
      const isTouchEvent = event.touches && event.touches.length;

      // Find the center points of the event.
      const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX;
      const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;

      // The pointer location is relative to the element offset.
      this.position.x = pageX - this.offset.left;
      this.position.y = pageY - this.offset.top;
    }

    return this.position;
  }

  /**
   * Triggers adding of a new ripple on touch start event.
   * @param {Object} event The even object.
   */
  handleClick = (event) => {
    if (this.props.disabled) {
      return;
    }
    this.addRipple(event, true);
    this.props.onClick();
  };

  /**
   * Will be triggered from the ripple animation component, when the
   * ripple animation is over. It removes the ripple from the queue again.
   */
  removeRipple = () => {
    if (!this.mounted) {
      return;
    }

    this.setState(({ prevState }) => {
      const ripples = shift(prevState.ripples);
      this.props.onComplete();

      return {
        ripples,
        hasRipples: !!(ripples.length),
      };
    });
  };

  /**
   * Adds a new Ripple to the queue.
   * @param {Object} event The event object.
   * @param {boolean} isTouchGenerated Whether the action was triggered by a touch or click.
   */
  addRipple(event, isTouchGenerated) {
    // If the adding of the Ripple was already triggered
    // By a touch start event, no further action will be done.
    if (this.ignoreNextMouseDown && !isTouchGenerated) {
      this.ignoreNextMouseDown = false;
      return;
    }

    // Get the position of the element and store it.
    this.offset = getOffset(this.rootNode);

    // Receive the x and y position for the new Ripple.
    const { x, y } = this.getRipplePosition(event);

    const { ripples } = this.state;

    // Append the new ripple to the ripples array.
    ripples.push(<RippleAnimation
      color={this.props.color}
      duration={this.duration}
      fill={this.props.fill}
      key={this.state.nextKey}
      onComplete={this.removeRipple}
      size={this.rippleSize}
      x={x}
      y={y}
    />);

    this.ignoreNextMouseDown = isTouchGenerated;

    // Update the state.
    this.setState(({ nextKey }) => ({
      ripples,
      nextKey: nextKey + 1,
      hasRipples: true,
    }));
  }

  /**
   * Renders all the ripples in the queue.
   * @returns {JSX|null}
   */
  renderRipples() {
    // It only needs to render, if there is at least one ripple in the queue.
    if (!this.state.hasRipples) {
      return null;
    }

    return (
      <div className={style.container}>
        {this.state.ripples}
      </div>
    );
  }

  /**
   * Renders the final ripple component including it's contents.
   * @returns {JSX}
   */
  render() {
    /* eslint-disable jsx-a11y/click-events-have-key-events,
    jsx-a11y/no-static-element-interactions */
    return (
      <div
        className={this.props.className}
        data-test-id="Ripple"
        onClick={this.handleClick}
        style={this.style}
      >
        {this.renderRipples()}
        {this.props.children}
      </div>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events,
    jsx-a11y/no-static-element-interactions */
  }
}

export default Ripple;
