import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Transition from '../Transition';
import transitions from './transitions';

const useStyles = makeStyles()(() => ({
  container: {
    overflow: 'hidden',
  },
}));

/**
 * This component slides it's child content up or down based on it's isOpen property.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Dropdown = ({
  children,
  className,
  duration,
  easing,
  isOpen,
  onComplete,
  onStart,
}) => {
  const { classes } = useStyles();
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (isOpen === true) {
      setInitialRender(false);
    }
  }, [isOpen]);

  let transitionProps;
  if (isOpen && initialRender) {
    transitionProps = transitions.initialOpen;
  } else if (isOpen) {
    transitionProps = transitions.open;
  } else if (initialRender) {
    transitionProps = transitions.initialClose;
  } else {
    transitionProps = transitions.close;
  }

  return (
    <Transition
      {...transitionProps}
      onComplete={onComplete}
      onStart={onStart}
      duration={duration}
      easing={easing}
    >
      <div className={`${classes.container} ${className} common__dropdown`} aria-hidden={!isOpen}>
        {children}
      </div>
    </Transition>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  duration: PropTypes.number,
  easing: PropTypes.string,
  isOpen: PropTypes.bool,
  onComplete: PropTypes.func,
  onStart: PropTypes.func,
};

Dropdown.defaultProps = {
  className: '',
  children: null,
  duration: 150,
  easing: null,
  isOpen: false,
  onComplete: () => {},
  onStart: () => {},
};

export default memo(Dropdown, (prev, next) => prev.isOpen === next.isOpen);
