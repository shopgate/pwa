import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';
import classNames from 'classnames';
import styles from './style';

/**
 * The Modal component.
 * @param {Object} props The component props.
 * @param {Object} props.classes The component classes.
 * @returns {JSX.Element}
 */
const Modal = forwardRef(({
  children, classes, ...props
}, ref) => {
  // Track modal visibility for accessibility purposes.
  useTrackModalState();

  return (
    createPortal((
      <div
        className={classNames(styles.container, classes?.container, 'common__modal')}
        role="alertdialog"
        aria-modal
        {...props}
        ref={ref}
      >
        <div className={classNames(styles.layout, classes?.layout)}>
          <div className={classNames(styles.content, classes?.content)}>
            {children}
          </div>
        </div>
      </div>
    ), document.getElementById('portals'))
  );
});

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
