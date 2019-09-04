import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style';
import RangeSliderHandle from './components/Handle';
import {
  generateLinearEasingCallback,
  generateExponentialEasingCallback,
  getRangeStyle,
  getTouchPositionX,
  getAbsoluteValue,
  getRelativeValue,
} from './helper';

/**
 * The range slider component.
 */
class RangeSlider extends Component {
  static propTypes = {
    animationSpeed: PropTypes.number, // The animation speed of the handles in px/sec.
    classNames: PropTypes.shape({
      container: PropTypes.string, // The container style.
      handleInner: PropTypes.string, // The inner handle style.
      handleOuter: PropTypes.string, // The outer handle style.
      outerRange: PropTypes.string, // The outer range style.
      range: PropTypes.string, // The inner range style.
    }), // Additional style classes for the slider.
    easing: PropTypes.string, // The name of builtin easing function.
    factor: PropTypes.number, // The factor for the exponential easing.
    max: PropTypes.number, // The maximum range value.
    min: PropTypes.number, // The minimum range value.
    onChange: PropTypes.func, // Callback for changes to the range selection.
    resolution: PropTypes.number, // The resolution for the linear easing.
    value: PropTypes.arrayOf(PropTypes.number), // A pair describing the initial selection.
  };

  static defaultProps = {
    animationSpeed: 500,
    classNames: {},
    easing: 'linear',
    factor: 2,
    max: 100,
    min: 0,
    resolution: 1,
    value: [0, 100],
    onChange: null,
  };

  /**
   * Constructor
   * @param {Object} props The component properties
   */
  constructor(props) {
    super(props);

    this.draggedHandle = null; // 0 for left handle, 1 for right handle or null
    this.domElement = null;
    this.touchOffset = 0;
    this.draggedHandlePixelOffset = 0; // The absolute pixel delta of the last handle move event.

    this.state = this.getRange(props);
  }

  /**
   * Sets the global event listeners when component mounts.
   */
  componentDidMount() {
    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('touchmove', this.handleTouchMove);
  }

  /**
   * Updates the component properties.
   * @param {Object} newProps The new component properties.
   */
  componentWillReceiveProps(newProps) {
    this.setState(this.getRange(newProps));
  }

  /**
   * Removes the global event listeners when component unmounts.
   */
  componentWillUnmount() {
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchmove', this.handleTouchMove);
  }

  /**
   * Get the easing function.
   */
  get ease() {
    return (
      {
        linear: generateLinearEasingCallback(this.props.resolution),
        exponential: generateExponentialEasingCallback(this.props.factor),
      }[this.props.easing]
    );
  }

  /**
   * Get the function to invert an eased value to it's original value.
   */
  get invertedEase() {
    return (
      {
        linear: generateLinearEasingCallback(this.props.resolution),
        exponential: generateExponentialEasingCallback(1 / this.props.factor),
      }[this.props.easing]
    );
  }

  /**
   * Get range mina and max from props.
   * @param {Object} props The component props.
   * @returns {Object} The new state
   */
  getRange(props) {
    const { value, min, max } = props;

    return ({
      rangeMin: this.invertedEase(getRelativeValue(value[0], min, max)),
      rangeMax: this.invertedEase(getRelativeValue(value[1], min, max)),
    });
  }

  /**
   * Processes touch start events on handles.
   * @param {Object} event The touch event
   * @param {number} index The index of the touched handle.
   */
  handleTouchStart = (event, index) => {
    this.draggedHandle = index;

    // Calculate the relative offset to the handles center
    const handleDOMElement = event.target;
    // Get the handles bounding rectangle ...
    const handleRect = handleDOMElement.getBoundingClientRect();
    // ... and calculate its absolute center.
    const handleCenterX = handleRect.left + (handleDOMElement.offsetWidth / 2);
    // Store the signed distanced between the current touch offset and the handle center.
    this.touchOffset = getTouchPositionX(event) - handleCenterX;
  }

  /**
   * Processes move events on handles.
   * @param {Object} event The touch event
   */
  handleTouchMove = (event) => {
    if (this.props.min === this.props.max) {
      return;
    }

    if (this.draggedHandle === null) {
      return;
    }

    const { offsetWidth, offsetLeft } = this.domElement;
    // Calculate the absolute offset where the element was touched...
    let deltaX = (getTouchPositionX(event) - offsetLeft) - this.touchOffset;

    // ...and convert it into a relative value between [0...1].
    deltaX = Math.max(0, Math.min(1, deltaX / offsetWidth));

    const stateUpdate = {};

    if (this.draggedHandle === 1) {
      // Right handle dragged
      if (this.state.rangeMin < deltaX) {
        stateUpdate.rangeMax = Math.min(1, deltaX);
        this.draggedHandlePixelOffset = Math.abs(stateUpdate.rangeMax - this.state.rangeMax);
      } else {
        // Not in valid range, swap handles
        this.draggedHandle = 0;
        stateUpdate.rangeMax = this.state.rangeMin;
        stateUpdate.rangeMin = deltaX;
        this.draggedHandlePixelOffset = Math.abs(stateUpdate.rangeMin - this.state.rangeMin);
      }
    } else if (this.draggedHandle === 0) {
      // Left handle dragged
      if (this.state.rangeMax > deltaX) {
        stateUpdate.rangeMin = Math.max(0, deltaX);
        this.draggedHandlePixelOffset = Math.abs(stateUpdate.rangeMin - this.state.rangeMin);
      } else {
        // Not in valid range, swap handles
        this.draggedHandle = 1;
        stateUpdate.rangeMin = this.state.rangeMax;
        stateUpdate.rangeMax = deltaX;
        this.draggedHandlePixelOffset = Math.abs(stateUpdate.rangeMax - this.state.rangeMax);
      }
    }

    this.draggedHandlePixelOffset *= this.domElement.offsetWidth;

    this.setState(stateUpdate, this.triggerChangeCallback);
  }

  /**
   * Processes global touch end events for handles.
   * @param {Object} e The touch event
   */
  handleTouchEnd = () => {
    this.touchOffset = 0;
    this.draggedHandle = null;
  }

  /**
   * Processes outer range touch end events.
   * @param {Object} event The touch event
   */
  handleRangeTouch = (event) => {
    const { offsetWidth, offsetLeft } = this.domElement;
    const dx = (getTouchPositionX(event) - offsetLeft) / offsetWidth;
    const d0 = Math.abs(this.state.rangeMin - dx);
    const d1 = Math.abs(this.state.rangeMax - dx);

    if (d0 < d1) {
      this.draggedHandle = 0;
    } else {
      this.draggedHandle = 1;
    }

    this.handleTouchMove(event);
  }

  /**
   * Calls the change callback in case of a state update.
   */
  triggerChangeCallback() {
    const {
      value,
      onChange,
      min,
      max,
    } = this.props;

    if (!onChange) {
      return;
    }

    const newRange = [
      getAbsoluteValue(this.ease(this.state.rangeMin), min, max, true),
      getAbsoluteValue(this.ease(this.state.rangeMax), min, max, true),
    ];

    if (newRange !== value) {
      onChange(newRange);
    }
  }

  /**
   * Creates a new handle component.
   * @param {number} index The index of the component. Must be either 0 or 1.
   * @returns {JSX}
   */
  makeHandle(index) {
    return (
      <RangeSliderHandle
        index={index}
        onTouchStart={this.handleTouchStart}
        active={this.draggedHandle === index}
        classNames={this.props.classNames}
      />
    );
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    // Calculate the animation speed.
    const animationSpeed = Math.round((
      (1000 / this.props.animationSpeed) * this.draggedHandlePixelOffset
    ));
    const rangeStyle = getRangeStyle(
      this.state.rangeMin,
      this.state.rangeMax,
      animationSpeed > 10 ? animationSpeed : 0
    );

    return (
      <div
        className={this.props.classNames.container || ''}
        onTouchStart={this.handleRangeTouch}
      >
        <div
          className={`${this.props.classNames.outerRange || ''} ${styles.outerRange}`}
          ref={(ref) => { this.domElement = ref; }}
        >
          <div className={`${this.props.classNames.range || ''} ${styles.range}`} style={rangeStyle}>
            {this.makeHandle(0)}
            {this.makeHandle(1)}
          </div>
        </div>
      </div>
    );
  }
}

export default RangeSlider;
