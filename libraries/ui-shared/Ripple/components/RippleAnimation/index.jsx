import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import style from '../../style';

const transitionStyles = {
  entering: {
    transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
    opacity: 0,
  },
  entered: {
    transform: 'translate3d(-50%, -50%, 0) scale3d(1, 1, 1)',
    opacity: 0,
  },
};

/**
 * The ripple animation component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function RippleAnimation(props) {
  const {
    color, duration, onComplete, size, x, y,
  } = props;

  const defaultStyles = useMemo(() => ({
    backgroundColor: color,
    height: size,
    width: size,
    transform: 'translate3d(-50%, -50%, 0) scale3d(0, 0, 1)',
    transition: `opacity ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1), transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
    left: x,
    top: y,
    opacity: 0.25,
  }), [color, duration, size, x, y]);

  return (
    <Transition in timeout={duration} onEntered={onComplete}>
      {state => (
        <div
          className={style.ripple}
          style={{
            ...defaultStyles,
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
  onComplete() { },
  size: 48,
  x: 0,
  y: 0,
};

export default memo(RippleAnimation);
