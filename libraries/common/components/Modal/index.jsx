import React from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import styles from './style';

/**
 * The Modal component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Modal = ({ children }) => (
  <Portal isOpened>
    <div className={`${styles.container} common__modal`}>
      <div className={styles.layout}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  </Portal>
);

Modal.propTypes = {
  children: PropTypes.node,
};

Modal.defaultProps = {
  children: null,
};

export default Modal;
