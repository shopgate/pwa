import React from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-portal';
import classNames from 'classnames';
import styles from './style';

/**
 * The Modal component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Modal = ({ children, classes }) => (
  <Portal isOpened>
    <div className={classNames(styles.container, classes?.container, 'common__modal')}>
      <div className={classNames(styles.layout, classes?.layout)}>
        <div className={classNames(styles.content, classes?.content)}>
          {children}
        </div>
      </div>
    </div>
  </Portal>
);

Modal.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.shape({
    container: PropTypes.string,
    layout: PropTypes.string,
    content: PropTypes.string,
  }),
};

Modal.defaultProps = {
  children: null,
  classes: {
    container: '',
    layout: '',
    content: '',
  },
};

export default Modal;
