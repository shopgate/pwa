import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, keyframes } from '@shopgate/engage/styles';

const duration = 150;
const easing = 'ease';

const slideInBaseDrawer = keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const slideOutBaseDrawer = keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const useStyles = makeStyles()(() => ({
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: 5,
  },
  animationIn: {
    animation: `${slideInBaseDrawer} ${duration}ms 1 forwards ${easing}`,
  },
  animationOut: {
    animation: `${slideOutBaseDrawer} ${duration}ms 1 forwards ${easing}`,
  },
}));

/**
 * Drawer component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const Drawer = ({
  animation,
  children,
  className,
  isOpen,
  onOpen,
  onClose,
  onDidClose,
  onDidOpen,
}) => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(isOpen);
  const sheetRef = useRef(null);
  const isFirstIsOpenSync = useRef(true);

  useEffect(() => {
    if (isFirstIsOpenSync.current) {
      isFirstIsOpenSync.current = false;
      return;
    }
    if (isOpen) {
      onOpen();
      setActive(true);
    } else {
      onClose();
    }
  }, [isOpen, onOpen, onClose]);

  useEffect(() => {
    if (isOpen && sheetRef.current) {
      sheetRef.current.focus();
    }
  }, [isOpen]);

  const handleAnimationEnd = useCallback(() => {
    setActive(isOpen);
    if (!isOpen) {
      onDidClose();
    } else {
      onDidOpen();
    }
  }, [isOpen, onDidClose, onDidOpen]);

  const animationIn = animation.in || classes.animationIn;
  const animationOut = animation.out || classes.animationOut;

  const combinedClassName = cx(
    className,
    classes.container,
    { [animationIn]: isOpen },
    { [animationOut]: !isOpen },
    'common__drawer'
  );

  const style = {};
  if (typeof animation.duration === 'number') {
    style.animationDuration = `${animation.duration}ms`;
  }

  if (!active) {
    return null;
  }

  return (
    <div
      ref={sheetRef}
      className={combinedClassName}
      style={style}
      onAnimationEnd={() => {
        handleAnimationEnd();
        if (sheetRef?.current?.style) {
          sheetRef.current.style.animation = '';
          sheetRef.current.style.transform = 'none';
        }
      }}
      role="dialog"
      aria-modal
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

Drawer.propTypes = {
  animation: PropTypes.shape({
    duration: PropTypes.number,
    in: PropTypes.string,
    out: PropTypes.string,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onDidClose: PropTypes.func,
  onDidOpen: PropTypes.func,
  onOpen: PropTypes.func,
};

Drawer.defaultProps = {
  animation: {
    duration: null,
    in: '',
    out: '',
  },
  children: null,
  className: '',
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onDidClose: () => {},
  onDidOpen: () => {},
};

export default Drawer;
