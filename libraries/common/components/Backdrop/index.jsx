import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import style from './style';

/**
 * Backdrop component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Backdrop(props) {
  const {
    className, color, duration, isVisible, level, onClick, opacity,
  } = props;

  const floatedOpacity = useMemo(() => (opacity / 100), [opacity]);

  const defaultStyles = useMemo(() => ({
    background: color,
    opacity: 0,
    transition: `opacity ${duration}ms ease-out`,
    zIndex: level,
  }), [color, duration, level]);

  const transitionStyles = useMemo(() => ({
    entering: { opacity: 0 },
    entered: { opacity: floatedOpacity },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  }), [floatedOpacity]);

  return (
    <Transition in={isVisible} timeout={duration} mountOnEnter unmountOnExit>
      {state => (
        <div
          data-test-id="Backdrop"
          aria-hidden
          className={`${style} ${className}`.trim()}
          onClick={onClick}
          style={{
            ...defaultStyles,
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
  onClick: PropTypes.func,
  opacity: PropTypes.number,
};

Backdrop.defaultProps = {
  className: '',
  color: '#000',
  duration: 200,
  isVisible: false,
  level: 2,
  onClick: () => { },
  opacity: 50,
};

export default memo(Backdrop);
