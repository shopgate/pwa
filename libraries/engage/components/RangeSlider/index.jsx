import React, {
  useState, useEffect, useRef, useMemo, useCallback, useReducer, memo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Handle from './components/Handle';
import { isTouchDevice } from '../../core';
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

const useMouseEvents = !isTouchDevice();

/**
 * The range slider component.
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
  const { classes, cx } = useStyles();
  const domElement = useRef(null);
  const draggedHandle = useRef(null);
  const touchOffset = useRef(0);
  const draggedHandlePixelOffset = useRef(0);
  const stateRef = useRef({ rangeMin: 0, rangeMax: 1 });
  const moveRef = useRef(() => { });
  const endRef = useRef(() => { });
  const docListenersRef = useRef({ onMove: null, onEnd: null });
  const [, forceActiveRender] = useReducer(x => x + 1, 0);

  const ease = useMemo(() => (
    {
      linear: generateLinearEasingCallback(resolution),
      exponential: generateExponentialEasingCallback(factor),
    }[easing]
  ), [easing, resolution, factor]);

  const invertedEase = useMemo(() => (
    {
      linear: generateLinearEasingCallback(resolution),
      exponential: generateExponentialEasingCallback(1 / factor),
    }[easing]
  ), [easing, resolution, factor]);

  const getRange = useCallback(p => ({
    rangeMin: invertedEase(getRelativeValue(p.value[0], p.min, p.max)),
    rangeMax: invertedEase(getRelativeValue(p.value[1], p.min, p.max)),
  }), [invertedEase]);

  const [state, setState] = useState(() => {
    const initial = getRange({
      value,
      min,
      max,
    });
    stateRef.current = initial;
    return initial;
  });

  useEffect(() => {
    const next = getRange({
      value,
      min,
      max,
    });
    stateRef.current = next;
    setState(next);
  }, [value, min, max, getRange]);

  const propsRef = useRef({
    value,
    onChange,
    min,
    max,
    ease,
  });
  propsRef.current = {
    value,
    onChange,
    min,
    max,
    ease,
  };

  const removeEventListeners = useCallback(() => {
    const { onMove, onEnd } = docListenersRef.current;
    if (!onMove || !onEnd) {
      return;
    }
    if (useMouseEvents) {
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('mousemove', onMove);
    } else {
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchmove', onMove);
    }
  }, []);

  const triggerChangeCallback = useCallback((mergedState) => {
    const {
      onChange: oc, value: v, min: mn, max: mx, ease: ez,
    } = propsRef.current;
    if (!oc) {
      return;
    }

    const newRange = [
      getAbsoluteValue(ez(mergedState.rangeMin), mn, mx, true),
      getAbsoluteValue(ez(mergedState.rangeMax), mn, mx, true),
    ];

    if (newRange !== v) {
      oc(newRange);
    }
  }, []);

  const handleTouchMove = useCallback((event) => {
    if (min === max) {
      return;
    }

    if (draggedHandle.current === null) {
      return;
    }

    const {
      width: offsetWidth,
      left: offsetLeft,
    } = domElement.current.getBoundingClientRect();

    let deltaX = (getTouchPositionX(event) - offsetLeft) - touchOffset.current;

    deltaX = Math.max(0, Math.min(1, deltaX / offsetWidth));

    const stateUpdate = {};
    const { rangeMin, rangeMax } = stateRef.current;

    if (draggedHandle.current === 1) {
      if (rangeMin < deltaX) {
        stateUpdate.rangeMax = Math.min(1, deltaX);
        draggedHandlePixelOffset.current = Math.abs(
          stateUpdate.rangeMax - rangeMax
        );
      } else {
        draggedHandle.current = 0;
        stateUpdate.rangeMax = rangeMin;
        stateUpdate.rangeMin = deltaX;
        draggedHandlePixelOffset.current = Math.abs(
          stateUpdate.rangeMin - rangeMin
        );
      }
    } else if (draggedHandle.current === 0) {
      if (rangeMax > deltaX) {
        stateUpdate.rangeMin = Math.max(0, deltaX);
        draggedHandlePixelOffset.current = Math.abs(
          stateUpdate.rangeMin - rangeMin
        );
      } else {
        draggedHandle.current = 1;
        stateUpdate.rangeMin = rangeMax;
        stateUpdate.rangeMax = deltaX;
        draggedHandlePixelOffset.current = Math.abs(
          stateUpdate.rangeMax - rangeMax
        );
      }
    }

    draggedHandlePixelOffset.current *= offsetWidth;

    setState((prev) => {
      const next = { ...prev, ...stateUpdate };
      stateRef.current = next;
      queueMicrotask(() => triggerChangeCallback(next));
      return next;
    });
  }, [triggerChangeCallback]);

  const handleTouchEnd = useCallback(() => {
    removeEventListeners();
    touchOffset.current = 0;
    draggedHandle.current = null;
    forceActiveRender();
  }, [removeEventListeners]);

  moveRef.current = handleTouchMove;
  endRef.current = handleTouchEnd;

  const addEventListeners = useCallback(() => {
    if (!docListenersRef.current.onMove) {
      docListenersRef.current.onMove = e => moveRef.current(e);
      docListenersRef.current.onEnd = () => endRef.current();
    }
    const { onMove, onEnd } = docListenersRef.current;
    if (useMouseEvents) {
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('mousemove', onMove);
    } else {
      document.addEventListener('touchend', onEnd);
      document.addEventListener('touchmove', onMove);
    }
  }, []);

  const handleTouchStart = useCallback((event, index) => {
    addEventListeners();

    draggedHandle.current = index;

    const handleDOMElement = event.target;
    const handleRect = handleDOMElement.getBoundingClientRect();
    const handleCenterX = handleRect.left + (handleDOMElement.offsetWidth / 2);
    touchOffset.current = getTouchPositionX(event) - handleCenterX;
    forceActiveRender();
  }, [addEventListeners]);

  const handleRangeTouch = useCallback((event) => {
    const {
      width: offsetWidth,
      left: offsetLeft,
    } = domElement.current.getBoundingClientRect();

    const dx = (getTouchPositionX(event) - offsetLeft) / offsetWidth;
    const { rangeMin, rangeMax } = stateRef.current;
    const d0 = Math.abs(rangeMin - dx);
    const d1 = Math.abs(rangeMax - dx);

    if (d0 < d1) {
      draggedHandle.current = 0;
    } else {
      draggedHandle.current = 1;
    }

    handleTouchMove(event);
  }, [handleTouchMove]);

  const speed = Math.round(
    (1000 / animationSpeed) * draggedHandlePixelOffset.current
  );
  const rangeStyle = getRangeStyle(
    state.rangeMin,
    state.rangeMax,
    speed > 10 ? speed : 0
  );

  return (
    <div className={cx(classNames.container, 'engage__range-slider')} onMouseDown={handleRangeTouch} aria-hidden>
      <div className={cx(classNames.outerRange, classes.outerRange)} ref={domElement}>
        <div className={cx(classNames.range, classes.range)} style={rangeStyle}>
          <Handle
            index={0}
            onTouchStart={handleTouchStart}
            active={draggedHandle.current === 0}
            classNames={classNames}
            useMouseEvents={useMouseEvents}
          />
          <Handle
            index={1}
            onTouchStart={handleTouchStart}
            active={draggedHandle.current === 1}
            classNames={classNames}
            useMouseEvents={useMouseEvents}
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
