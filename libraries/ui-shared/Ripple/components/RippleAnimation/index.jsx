import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import style from '../../style';

/**
 * The RippleAnimation component
 *
 * Plays a one-shot ripple animation and calls `onComplete` when finished.
 * @param {Object} props The component props.
 * @param {string} props.color The ripple color.
 * @param {number} props.duration The animation duration in milliseconds.
 * @param {Function} props.onComplete The callback to be called when the animation is complete.
 * @param {number} props.size The size of the ripple in pixels.
 * @param {number} props.x The x coordinate of the ripple center.
 * @param {number} props.y The y coordinate of the ripple center.
 * @returns {JSX.Element}
 */
function RippleAnimation({
  color,
  duration,
  onComplete,
  size,
  x,
  y,
}) {
  const nodeRef = useRef(null);

  // Trigger the animation immediately
  const inProp = true;

  const baseStyle = useMemo(() => ({
    position: 'absolute',
    backgroundColor: color,
    height: size,
    width: size,
    left: x,
    top: y,
    borderRadius: '50%',
    transform: 'translate3d(-50%, -50%, 0) scale3d(0, 0, 1)',
    opacity: 0.25,
    transition: `opacity ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1), transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
    pointerEvents: 'none',
  }), [color, duration, size, x, y]);

  const transitionStyles = useMemo(() => ({
    entering: {
      transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
      opacity: 0,
    },
    entered: {
      transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
      opacity: 0,
    },
    exiting: {},
    exited: {},
    unmounted: {},
  }), []);

  // Run callback when transition ends
  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return undefined;

    /**
     * Handles the transition end event and calls onComplete for relevant properties.
     * @param {TransitionEvent} e - The transition event object
     */
    const handleEnd = (e) => {
      // Only handle transform or opacity transitions
      if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
        onComplete();
      }
    };

    el.addEventListener('transitionend', handleEnd);
    return () => el.removeEventListener('transitionend', handleEnd);
  }, [onComplete]);

  return (
    <Transition
      in={inProp}
      timeout={duration}
      appear
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
    >
      {state => (
        <div
          ref={nodeRef}
          className={style.ripple}
          style={{
            ...baseStyle,
            ...transitionStyles[state],
          }}
        />
      )}
    </Transition>
  );
}

RippleAnimation.propTypes = {
  color: PropTypes.string,
  duration: PropTypes.number,
  onComplete: PropTypes.func,
  size: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
};

RippleAnimation.defaultProps = {
  color: themeConfig.colors.dark,
  duration: 300,
  onComplete: () => {},
  size: 48,
  x: 0,
  y: 0,
};

export default React.memo(RippleAnimation);
