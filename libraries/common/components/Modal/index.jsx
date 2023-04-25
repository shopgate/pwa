import React from 'react';
import PropTypes from 'prop-types';
import ReactPortal from '../ReactPortal';
import styles from './style';

/**
 * The Modal component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Modal = ({ children }) => (
  <ReactPortal isOpened>
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  </ReactPortal>
);

Modal.propTypes = {
  children: PropTypes.node,
};

Modal.defaultProps = {
  children: null,
};

export default Modal;
