import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import RangeSliderHandle from './components/Handle';
import {
  generateLinearEasingCallback,
  generateExponentialEasingCallback,
  getRangeStyle,
  getTouchPositionX,
  getAbsoluteValue,
  getRelativeValue,
} from './helper';

const useStyles = makeStyles()({
  outerRange: {
    minHeight: 1,
    position: 'relative',
  },
  range: {
    left: 0,
    right: 0,
    position: 'absolute',
  },
});

/**
 * Maps slider props to internal eased range state.
 * @param {Object} props Slider props (value, min, max).
 * @param {Function} invertedEase Inverted easing function.
 * @returns {{ rangeMin: number, rangeMax: number }}
 */
const computeRange = (props, invertedEase) => {
  const { value, min, max } = props;
  return {
    rangeMin: invertedEase(getRelativeValue(value[0], min, max)),
    rangeMax: invertedEase(getRelativeValue(value[1], min, max)),
  };
};

/**
 * The range slider component.
 * @deprecated
 *             Please use `import { RangeSlider } from '@shopgate/engage/components'` instead.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const RangeSlider = ({
  animationSpeed,
  classNames,
  easing,
  factor,
  max,
  min,
  onChange,
  resolution,
  value,
}) => {
  const { classes } = useStyles();

  const invertedEase = useMemo(() => (
    {
      linear: generateLinearEasingCallback(resolution),
      exponential: generateExponentialEasingCallback(1 / factor),
    }[easing]
  ), [easing, factor, resolution]);

  const ease = useMemo(() => (
    {
      linear: generateLinearEasingCallback(resolution),
      exponential: generateExponentialEasingCallback(factor),
    }[easing]
  ), [easing, factor, resolution]);

  const [rangeState, setRangeState] = useState(() => (
    computeRange({
      value,
      min,
      max,
    }, invertedEase)
  ));
  const [draggedHandle, setDraggedHandle] = useState(null);

  const rangeStateRef = useRef(rangeState);
  rangeStateRef.current = rangeState;

  const draggedHandleRef = useRef(null);
  draggedHandleRef.current = draggedHandle;

  const domElementRef = useRef(null);
  const touchOffsetRef = useRef(0);
  const draggedHandlePixelOffsetRef = useRef(0);

  const propsRef = useRef({
    min,
    max,
    onChange,
    value,
    ease,
  });
  propsRef.current = {
    min,
    max,
    onChange,
    value,
    ease,
  };

  useEffect(() => {
    logger.warn(
      '===== RangeSlider deprecated =====\n'
      + 'The RangeSlider component and it\'s related components '
      + '(@shopgate/pwa-common/component/RangeSlider) are deprecated\n'
      + 'Please use: import { RangeSlider } from \'@shopgate/engage/components\'.\n'
      + '==================================='
    );
  }, []);

  useEffect(() => {
    setRangeState(computeRange({
      value,
      min,
      max,
    }, invertedEase));
  }, [invertedEase, max, min, value]);

  const triggerChangeCallback = useCallback(() => {
    const {
      onChange: oc,
      value: v,
      min: lo,
      max: hi,
      ease: easeFn,
    } = propsRef.current;
    if (!oc) {
      return;
    }
    const { rangeMin, rangeMax } = rangeStateRef.current;
    const newRange = [
      getAbsoluteValue(easeFn(rangeMin), lo, hi, true),
      getAbsoluteValue(easeFn(rangeMax), lo, hi, true),
    ];
    if (newRange !== v) {
      oc(newRange);
    }
  }, []);

  const handleTouchMove = useCallback((event) => {
    const { min: lo, max: hi } = propsRef.current;
    if (lo === hi) {
      return;
    }
    if (draggedHandleRef.current === null) {
      return;
    }

    const domElement = domElementRef.current;
    if (!domElement) {
      return;
    }

    const { offsetWidth, offsetLeft } = domElement;
    let deltaX = (getTouchPositionX(event) - offsetLeft) - touchOffsetRef.current;
    deltaX = Math.max(0, Math.min(1, deltaX / offsetWidth));

    const prev = rangeStateRef.current;
    const stateUpdate = {};
    let nextDragged = draggedHandleRef.current;

    if (draggedHandleRef.current === 1) {
      // Right handle dragged
      if (prev.rangeMin < deltaX) {
        stateUpdate.rangeMax = Math.min(1, deltaX);
        draggedHandlePixelOffsetRef.current = Math.abs(stateUpdate.rangeMax - prev.rangeMax);
      } else {
        // Not in valid range, swap handles
        nextDragged = 0;
        stateUpdate.rangeMax = prev.rangeMin;
        stateUpdate.rangeMin = deltaX;
        draggedHandlePixelOffsetRef.current = Math.abs(stateUpdate.rangeMin - prev.rangeMin);
      }
    } else if (draggedHandleRef.current === 0) {
      // Left handle dragged
      if (prev.rangeMax > deltaX) {
        stateUpdate.rangeMin = Math.max(0, deltaX);
        draggedHandlePixelOffsetRef.current = Math.abs(stateUpdate.rangeMin - prev.rangeMin);
      } else {
        // Not in valid range, swap handles
        nextDragged = 1;
        stateUpdate.rangeMin = prev.rangeMax;
        stateUpdate.rangeMax = deltaX;
        draggedHandlePixelOffsetRef.current = Math.abs(stateUpdate.rangeMax - prev.rangeMax);
      }
    }

    draggedHandlePixelOffsetRef.current *= domElement.offsetWidth;

    if (nextDragged !== draggedHandleRef.current) {
      draggedHandleRef.current = nextDragged;
      setDraggedHandle(nextDragged);
    }

    setRangeState((cur) => {
      const next = {
        ...cur,
        ...stateUpdate,
      };
      rangeStateRef.current = next;
      return next;
    });
    triggerChangeCallback();
  }, [triggerChangeCallback]);

  /**
   * Resets drag tracking when the user lifts their finger anywhere.
   */
  const handleTouchEnd = useCallback(() => {
    touchOffsetRef.current = 0;
    draggedHandleRef.current = null;
    setDraggedHandle(null);
  }, []);

  useEffect(() => {
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove);
    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchEnd, handleTouchMove]);

  const handleTouchStart = useCallback((event, index) => {
    draggedHandleRef.current = index;
    setDraggedHandle(index);
    const handleDOMElement = event.target;
    const handleRect = handleDOMElement.getBoundingClientRect();
    const handleCenterX = handleRect.left + (handleDOMElement.offsetWidth / 2);
    touchOffsetRef.current = getTouchPositionX(event) - handleCenterX;
  }, []);

  const handleRangeTouch = useCallback((event) => {
    const domElement = domElementRef.current;
    if (!domElement) {
      return;
    }
    const { offsetWidth, offsetLeft } = domElement;
    const dx = (getTouchPositionX(event) - offsetLeft) / offsetWidth;
    const prev = rangeStateRef.current;
    const d0 = Math.abs(prev.rangeMin - dx);
    const d1 = Math.abs(prev.rangeMax - dx);
    const index = d0 < d1 ? 0 : 1;
    draggedHandleRef.current = index;
    setDraggedHandle(index);
    handleTouchMove(event);
  }, [handleTouchMove]);

  const animationSpeedRounded = Math.round(
    (1000 / animationSpeed) * draggedHandlePixelOffsetRef.current
  );
  const rangeStyle = getRangeStyle(
    rangeState.rangeMin,
    rangeState.rangeMax,
    animationSpeedRounded > 10 ? animationSpeedRounded : 0
  );

  return (
    <div
      className={`${classNames.container || ''} common__range-slider`}
      onTouchStart={handleRangeTouch}
    >
      <div
        className={`${classNames.outerRange || ''} ${classes.outerRange}`}
        ref={domElementRef}
      >
        <div className={`${classNames.range || ''} ${classes.range}`} style={rangeStyle}>
          <RangeSliderHandle
            index={0}
            onTouchStart={handleTouchStart}
            active={draggedHandle === 0}
            classNames={classNames}
          />
          <RangeSliderHandle
            index={1}
            onTouchStart={handleTouchStart}
            active={draggedHandle === 1}
            classNames={classNames}
          />
        </div>
      </div>
    </div>
  );
};

RangeSlider.propTypes = {
  animationSpeed: PropTypes.number,
  classNames: PropTypes.shape({
    container: PropTypes.string,
    handleInner: PropTypes.string,
    handleOuter: PropTypes.string,
    outerRange: PropTypes.string,
    range: PropTypes.string,
  }),
  easing: PropTypes.string,
  factor: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  resolution: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.number),
};

RangeSlider.defaultProps = {
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

export default memo(RangeSlider);
