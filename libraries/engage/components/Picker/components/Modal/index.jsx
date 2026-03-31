import React, {
  useState, useEffect, useRef, useCallback, cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';

const FADE_DURATION = 150;
const SLIDE_DURATION = 150;
const EASING = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
const DURATION = Math.max(SLIDE_DURATION, FADE_DURATION);

const slideInPickerModal = keyframes({
  '0%': { transform: 'translateY(100%)' },
  '100%': { transform: 'translateY(0)' },
});

const slideOutPickerModal = keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100%)' },
});

const fadeInPickerBackground = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 0.5 },
});

const fadeOutPickerBackground = keyframes({
  '0%': { opacity: 0.5 },
  '100%': { opacity: 0 },
});

const useStyles = makeStyles()(() => ({
  wrapper: {
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backgroundBase: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    animation: `${fadeInPickerBackground} ${FADE_DURATION}ms 1 both`,
  },
  backgroundInactive: {
    animation: `${fadeOutPickerBackground} ${FADE_DURATION}ms 1 both`,
  },
  containerBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: themeColors.light,
    animation: `${slideInPickerModal} ${SLIDE_DURATION}ms 1 both ${EASING}`,
  },
  containerInactive: {
    animation: `${slideOutPickerModal} ${SLIDE_DURATION}ms 1 both ${EASING}`,
  },
}));

/**
 * The picker modal.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const PickerModal = ({ children, isOpen, onClose }) => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(isOpen);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setActive(isOpen);
  }, [isOpen]);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const closeModal = useCallback(() => {
    setActive(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(onClose, DURATION);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const backgroundClassName = cx(
    classes.backgroundBase,
    { [classes.backgroundInactive]: !active }
  );

  const containerClassName = cx(
    classes.containerBase,
    { [classes.containerInactive]: !active }
  );

  return (
    <div className={cx(classes.wrapper, 'engage__picker_modal')}>
      <div aria-hidden className={backgroundClassName} onClick={closeModal} />
      <div className={containerClassName}>
        {cloneElement(children, { onClose: closeModal })}
      </div>
    </div>
  );
};

PickerModal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PickerModal;
