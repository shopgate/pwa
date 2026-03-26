import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import clamp from 'lodash/clamp';
import { shift } from '@shopgate/pwa-common/helpers/data';
import { getOffset } from '@shopgate/pwa-common/helpers/dom';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';
import RippleAnimation from './components/RippleAnimation';

const useStyles = makeStyles()({
  container: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

/**
 * The ripple component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Ripple = ({
  children,
  className,
  color,
  disabled,
  fill,
  onClick,
  onComplete,
  overflow,
  size,
}) => {
  const { classes } = useStyles();
  const [{ ripples, hasRipples }, setRippleState] = useState({
    ripples: [],
    nextKey: 0,
    hasRipples: false,
  });

  const durationRef = useRef(500);
  const ignoreNextMouseDownRef = useRef(false);
  const mountedRef = useRef(false);
  const offsetRef = useRef(null);
  const positionRef = useRef({
    x: 0,
    y: 0,
  });
  const rootRef = useRef(null);
  const [containerStyle, setContainerStyle] = useState(null);

  const getRippleSize = useCallback(() => {
    const rootNode = rootRef.current;
    if (!rootNode) {
      return 0;
    }
    if (size) {
      return fill ? size * 2 : size;
    }
    if (fill) {
      return Math.sqrt((rootNode.offsetWidth ** 2) + (rootNode.offsetHeight ** 2)) * 2;
    }
    return Math.min(rootNode.offsetWidth, rootNode.offsetHeight);
  }, [fill, size]);

  useLayoutEffect(() => {
    const rootNode = rootRef.current;
    if (!rootNode) {
      return undefined;
    }
    mountedRef.current = true;
    positionRef.current = {
      x: rootNode.offsetWidth / 2,
      y: rootNode.offsetHeight / 2,
    };
    const rippleSize = (() => {
      if (size) {
        return fill ? size * 2 : size;
      }
      if (fill) {
        return Math.sqrt((rootNode.offsetWidth ** 2) + (rootNode.offsetHeight ** 2)) * 2;
      }
      return Math.min(rootNode.offsetWidth, rootNode.offsetHeight);
    })();
    durationRef.current = clamp(
      Math.round((Math.log(rippleSize) * 100) - (fill ? -75 : 50)),
      0,
      10000
    );
    setContainerStyle((!overflow) ? {
      overflow: 'hidden',
      position: 'relative',
    } : null);
    return () => {
      mountedRef.current = false;
    };
  }, [fill, overflow, size]);

  const getRipplePosition = useCallback((event) => {
    if (fill) {
      const isTouchEvent = event.touches && event.touches.length;
      const pageX = isTouchEvent ? event.touches[0].pageX : event.pageX;
      const pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;
      positionRef.current = {
        x: pageX - offsetRef.current.left,
        y: pageY - offsetRef.current.top,
      };
    }
    return positionRef.current;
  }, [fill]);

  const removeRipple = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }
    setRippleState((prev) => {
      const nextRipples = shift(prev.ripples);
      onComplete();
      return {
        ripples: nextRipples,
        nextKey: prev.nextKey,
        hasRipples: !!(nextRipples.length),
      };
    });
  }, [onComplete]);

  const addRipple = useCallback((event, isTouchGenerated) => {
    if (ignoreNextMouseDownRef.current && !isTouchGenerated) {
      ignoreNextMouseDownRef.current = false;
      return;
    }
    const rootNode = rootRef.current;
    if (!rootNode) {
      return;
    }
    offsetRef.current = getOffset(rootNode);
    const { x, y } = getRipplePosition(event);
    const rippleSize = getRippleSize();

    setRippleState((prev) => {
      const nextRipples = [...prev.ripples];
      nextRipples.push(
        <RippleAnimation
          color={color}
          duration={durationRef.current}
          fill={fill}
          key={prev.nextKey}
          onComplete={removeRipple}
          size={rippleSize}
          x={x}
          y={y}
        />
      );
      return {
        ripples: nextRipples,
        nextKey: prev.nextKey + 1,
        hasRipples: true,
      };
    });
    ignoreNextMouseDownRef.current = isTouchGenerated;
  }, [color, fill, getRipplePosition, getRippleSize, removeRipple]);

  const handleClick = useCallback((event) => {
    if (disabled) {
      return;
    }
    addRipple(event, true);
    onClick();
  }, [addRipple, disabled, onClick]);

  /* eslint-disable jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions */
  return (
    <div
      ref={rootRef}
      className={`ui-shared__ripple ${className}`}
      data-test-id="Ripple"
      onClick={handleClick}
      style={containerStyle}
    >
      {hasRipples ? (
        <div className={classes.container}>
          {ripples}
        </div>
      ) : null}
      {children}
    </div>
  );
  /* eslint-enable jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions */
};

Ripple.propTypes = {
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

Ripple.defaultProps = {
  className: '',
  color: themeConfig.colors.dark,
  disabled: false,
  fill: false,
  onClick: () => {},
  onComplete: () => {},
  overflow: false,
  size: null,
};

export default Ripple;
