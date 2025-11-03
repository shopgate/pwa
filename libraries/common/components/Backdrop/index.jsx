import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { toggleBodyScroll } from '@shopgate/engage/styles/helpers';
import style from './style';

/**
 * Backdrop component
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function Backdrop({
  className,
  color,
  duration,
  isVisible,
  level,
  lockBodyScroll,
  onClick,
  opacity,
}) {
  // Stable id for body scroll lock
  const bodyScrollRef = useRef(
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );

  const nodeRef = useRef(null);

  // Lock / unlock body scroll based on visibility
  useEffect(() => {
    if (!lockBodyScroll) return undefined;

    const refId = bodyScrollRef.current;

    toggleBodyScroll(isVisible, refId);

    return () => {
      toggleBodyScroll(false, refId);
    };
  }, [isVisible, lockBodyScroll]);

  const baseStyle = useMemo(() => ({
    background: color,
    zIndex: level,
    transition: `opacity ${duration}ms ease-out`,
    // start hidden by default; pointer events only when shown
    opacity: 0,
    pointerEvents: 'none',
  }), [color, level, duration]);

  const targetOpacity = useMemo(() => (opacity / 100), [opacity]);

  // Map Transition states to inline styles
  const transitionStyles = useMemo(() => ({
    entering: {
      opacity: targetOpacity,
      pointerEvents: 'auto',
    },
    entered: {
      opacity: targetOpacity,
      pointerEvents: 'auto',
    },
    exiting: {
      opacity: 0,
      pointerEvents: 'none',
    },
    exited: {
      opacity: 0,
      pointerEvents: 'none',
    },
    unmounted: {
      opacity: 0,
      pointerEvents: 'none',
    },
  }), [targetOpacity]);

  const combinedClassName = `${style} ${className} common__backdrop`;

  return (
    <Transition
      in={isVisible}
      timeout={duration}
      mountOnEnter
      unmountOnExit
      appear
      nodeRef={nodeRef}
    >
      {state => (
        <div
          ref={nodeRef}
          data-test-id="Backdrop"
          aria-hidden
          className={combinedClassName}
          onClick={onClick}
          style={{
            ...baseStyle,
            ...transitionStyles[state],
          }}
        />
      )}
    </Transition>
  );
}

Backdrop.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  duration: PropTypes.number,
  isVisible: PropTypes.bool,
  level: PropTypes.number,
  lockBodyScroll: PropTypes.bool,
  onClick: PropTypes.func,
  opacity: PropTypes.number,
};

Backdrop.defaultProps = {
  className: '',
  color: '#000',
  duration: 200,
  isVisible: false,
  level: 2,
  onClick: () => {},
  opacity: 50,
  lockBodyScroll: true,
};

export default React.memo(Backdrop, (prev, next) =>
  prev.isVisible === next.isVisible &&
  prev.className === next.className &&
  prev.color === next.color &&
  prev.duration === next.duration &&
  prev.level === next.level &&
  prev.lockBodyScroll === next.lockBodyScroll &&
  prev.opacity === next.opacity &&
  prev.onClick === next.onClick);
