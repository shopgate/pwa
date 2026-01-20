import React, { memo, useRef, useMemo } from 'react';
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

  const baseStyle = useMemo(
    () => ({
      backgroundColor: color,
      height: size,
      width: size,
      left: x,
      top: y,
      opacity: 0.25,
      transform: 'translate3d(-50%, -50%, 0) scale3d(0, 0, 1)',
      transition: `opacity ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1), transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
      willChange: 'transform, opacity',
    }),
    [color, size, x, y, duration]
  );

  const activeStyle = useMemo(
    () => ({
      transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
      opacity: 0,
    }),
    []
  );

  /**
   * Resolves ripple animation styles for a given transition state.
   *
   * @param {string} state React Transition state.
   * @returns {React.CSSProperties} Computed inline styles.
   */
  const getStyleForState = (state) => {
    // Transition states: 'entering', 'entered', 'exiting', 'exited'
    if (state === 'entering' || state === 'entered') {
      return {
        ...baseStyle,
        ...activeStyle,
      };
    }
    return baseStyle;
  };

  return (
    <Transition
      in
      timeout={{
        appear: duration,
        enter: duration,
        exit: 0,
      }}
      appear
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
      onEnter={() => {
        // Force layout/reflow so Safari & Chrome reliably apply the transition
        // before switching to the "entering" styles.
        if (nodeRef.current) {
          // eslint-disable-next-line no-unused-expressions
          nodeRef.current.offsetHeight;
        }
      }}
      onEntered={onComplete}
    >
      {state => (
        <div
          ref={nodeRef}
          className={style.ripple}
          style={getStyleForState(state)}
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

export default memo(RippleAnimation);
