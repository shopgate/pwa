import React from 'react';
import { shallow, mount } from 'enzyme';
import RangeSlider from './index';
import RangeSliderHandle from './components/Handle';
import {
  generateLinearEasingCallback,
  generateExponentialEasingCallback,
  getAbsoluteValue,
  getRelativeValue,
} from './helper';

/**
 * Creates a (fake) touch event.
 * @param {number} pageX the x page offset of the simulated touch event
 * @returns {Object} the new fake event containing only the properties required for testing.
 */
const createTouchEvent = (pageX) => {
  // Simulate a handle of 16px width.
  const simulatedHandleWidth = 16;
  const simulatedHandleHalfWidth = simulatedHandleWidth / 2;
  const touchEvent = {
    target: {
      offsetWidth: simulatedHandleWidth,
      getBoundingClientRect: () => (
        {
          // Simulate a touch on the center of the handle.
          left: pageX - simulatedHandleHalfWidth,
        }
      ),
    },
    touches: [{
      pageX,
    }],
  };

  return touchEvent;
};

/**
 * Simulates a series of touch events.
 * This function will automatically validate the from/to values of the range slider.
 * An extra testCallback may be provided to perform additional checks.
 *
 * @param {number} pxWidth The simulated width of the DOM element (in px).
 * @param {number} pxOffset The simulated left offset of the DOM element (in px).
 * @param {number} min The absolute minimum value of the slider.
 * @param {number} max The absolute maximum value of the slider.
 * @param {Array} value The initial value(s) of the slider.
 * @param {string} easing The name of the easing function.
 * @param {number} resolutionOrFactor The resolution or factor for the easing function.
 * @param {Array} simulateSteps A set of relative horizontal pixel movements to simulate.
 * @param {Function} testCallback An optional callback for the onChange event of the slider.
 */
const simulateInputTest = (
  pxWidth, pxOffset,
  min, max,
  value,
  easing,
  resolutionOrFactor,
  simulateSteps,
  testCallback
) => {
  const config = {
    totalPixelWidth: pxWidth,
    leftPixelOffset: pxOffset,
    min,
    max,
    easing,
    resolution: resolutionOrFactor,
    factor: resolutionOrFactor,
    initialValue: value,
    valuePixelSize: (pxWidth / (max - min)),
    currentTouchDeltaX: 0,
  };

  config.currentTouchDeltaX = config.valuePixelSize * value[1];

  const ease = {
    linear: generateLinearEasingCallback(config.resolution),
    exponential: generateExponentialEasingCallback(config.factor),
  }[config.easing];

  // eslint-disable-next-line require-jsdoc
  const callback = ([from, to]) => {
    const {
      currentTouchDeltaX,
      valuePixelSize,
    } = config;
    const relativeValue = getRelativeValue(currentTouchDeltaX / valuePixelSize, min, max);
    const expected =
      getAbsoluteValue(
        ease(relativeValue),
        config.min, config.max,
        true
      );

    expect(expected === from || expected === to).toBe(true);

    if (testCallback) {
      testCallback(config, from, to);
    }
  };

  const wrapper = mount((
    <RangeSlider
      min={config.min}
      max={config.max}
      value={config.initialValue}
      easing={easing}
      resolution={config.resolution}
      factor={config.factor}
      onChange={callback}
    />
  ));

  expect(wrapper).toMatchSnapshot();

  // Create a simulated touch event.
  const pageX = config.leftPixelOffset + config.currentTouchDeltaX;
  const touchEvent = createTouchEvent(pageX);
  const inst = wrapper.instance();

  inst.handleTouchStart(touchEvent, 1);

  simulateSteps.forEach((deltaX) => {
    config.currentTouchDeltaX += deltaX;
    touchEvent.touches[0].pageX = config.leftPixelOffset + config.currentTouchDeltaX;

    Object.defineProperty(inst.domElement, 'offsetLeft', {
      get: () => config.leftPixelOffset,
      configurable: true,
    });
    Object.defineProperty(inst.domElement, 'offsetWidth', {
      get: () => config.totalPixelWidth,
      configurable: true,
    });

    inst.handleTouchMove(touchEvent);
  });

  inst.handleTouchEnd();
};

describe.skip('<RangeSlider />', () => {
  /**
   * Simple attribute tests
   */

  it('renders with boundaries', () => {
    const wrapper = shallow(<RangeSlider min={0} max={100} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RangeSliderHandle).length).toBe(2);
  });

  it('renders without boundaries', () => {
    const wrapper = shallow(<RangeSlider />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RangeSliderHandle).length).toBe(2);
  });

  it('renders without a value pair', () => {
    const wrapper = shallow(<RangeSlider value={[10, 50]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(RangeSliderHandle).length).toBe(2);
  });

  /**
   * Callback tests
   */
  it('emits onChange if handle was touched (linear)', () => {
    simulateInputTest(
      100, 73, // Range slider pixel width and offset.
      0, 100, // Range slider minimum and maximum value.
      [50, 75], // Initial value.
      'linear', // Which wasing should be used.
      0.01, // Resolution.
      [ // A series of pixel offsets to move the slider handle.
        +0, +3, -15, +17, -80, +75,
      ]
    );
  });

  it('emits onChange if handle was touched (exponential)', () => {
    simulateInputTest(
      78, 12, // Range slider pixel width and offset.
      0, 1000, // Range slider minimum maximum value.
      [10, 450], // Initial value.
      'exponential', // Which wasing should be used.
      0.01, // Resolution.
      [ // A series of pixel offsets to move the slider handle.
        +10, +10, +10, +10, +10, +10, +10, +10,
        -10, -10, -10, -10, -10, -10, -10, -10,
        +3, -15, +17, -80, +104, -23, -12, +67,
      ]
    );
  });

  it('emits onChange if the outer range was touched', () => {
    // eslint-disable-next-line require-jsdoc
    const callback = value => expect(value).toEqual([-80, 0]);

    const wrapper = mount((
      <RangeSlider
        min={-100}
        max={100}
        value={[0, 0]}
        onChange={callback}
      />
    ));
    // Create a simulated touch event at a page x offset of 20px.
    const touchEvent = createTouchEvent(20);
    const inst = wrapper.instance();

    Object.defineProperty(inst.domElement, 'offsetLeft', {
      get: () => 0,
      configurable: true,
    });
    Object.defineProperty(inst.domElement, 'offsetWidth', {
      get: () => 200,
      configurable: true,
    });

    inst.handleRangeTouch(touchEvent);
  });
});
