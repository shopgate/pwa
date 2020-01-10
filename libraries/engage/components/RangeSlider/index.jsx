import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cxs from 'classnames';
import styles from './style';
import Handle from './components/Handle';
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
class RangeSlider extends PureComponent {
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
    this.domElement = React.createRef();
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
   * Get range min and max from props.
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

    const { offsetWidth, offsetLeft } = this.domElement.current;
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

    this.draggedHandlePixelOffset *= this.domElement.current.offsetWidth;

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
    const { offsetWidth, offsetLeft } = this.domElement.current;
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
   * Processes the input field values.
   * @param {Object} event The change event.
   */
  handleInputChange = (event) => {
    const { max } = this.props;
    const { value, id } = event.target;
    const delta = Math.max(0, Math.min(1, value / (max / 100)));
    const state = id === 'price_from' ? { rangeMin: delta } : { rangeMax: delta };

    this.setState(state);
  }

  /**
   * Updates the component properties.
   * @param {Object} newProps The new component properties.
   */
  UNSAFE_componentWillReceiveProps(newProps) { // eslint-disable-line camelcase
    this.setState(this.getRange(newProps));
  }

  /**
   * Calls the change callback in case of a state update.
   */
  triggerChangeCallback() {
    const {
      value, onChange, min, max,
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
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const { classNames, animationSpeed } = this.props;
    const speed = Math.round(((1000 / animationSpeed) * this.draggedHandlePixelOffset));
    const rangeStyle = getRangeStyle(
      this.state.rangeMin,
      this.state.rangeMax,
      speed > 10 ? speed : 0
    );

    return (
      <div className={cxs(classNames.container)} onTouchStart={this.handleRangeTouch} aria-hidden>
        <div className={cxs(classNames.outerRange, styles.outerRange)} ref={this.domElement}>
          <div className={cxs(classNames.range, styles.range)} style={rangeStyle}>
            <Handle
              index={0}
              onTouchStart={this.handleTouchStart}
              active={this.draggedHandle === 0}
              classNames={classNames}
            />
            <Handle
              index={1}
              onTouchStart={this.handleTouchStart}
              active={this.draggedHandle === 1}
              classNames={classNames}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default RangeSlider;
