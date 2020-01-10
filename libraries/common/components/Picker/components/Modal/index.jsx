import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

let timeout;

/**
 * The picker modal component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function PickerModal({ children, isOpen, onClose }) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    setActive(isOpen);
  }, [isOpen]);

  const bgClasses = useMemo(() => classNames(
    styles.background.base,
    { [styles.background.inactive]: active }
  ), [active]);

  const fgClasses = useMemo(() => classNames(
    styles.container.base,
    { [styles.container.inactive]: active }
  ), [active]);

  const handleClose = useCallback(() => {
    setActive(false);
    clearTimeout(timeout);
    setTimeout(onClose, styles.duration);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div aria-hidden className={bgClasses} onClick={handleClose} />
      <div className={fgClasses}>
        {React.cloneElement(children, { onClose: handleClose })}
      </div>
    </div>
  );
}

PickerModal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PickerModal;
