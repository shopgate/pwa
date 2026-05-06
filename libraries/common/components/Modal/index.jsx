import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { useTrackModalState } from '@shopgate/engage/a11y/hooks';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  container: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 2000,
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  content: {
    position: 'relative',
    maxWidth: '100vw',
    maxHeight: '100vh',
    paddingTop: 'var(--safe-area-inset-top)',
    paddingBottom: 'var(--safe-area-inset-bottom)',
    overflowY: 'scroll',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      overflowY: 'initial',
    },
  },
});

/**
 * The Modal component.
 * @param {Object} props The component props.
 * @param {Object} props.classes The component classes.
 * @returns {JSX.Element}
 */
const Modal = forwardRef(({
  children, classes: customClasses, ...props
}, ref) => {
  const { classes, cx } = useStyles();
  // Track modal visibility for accessibility purposes.
  useTrackModalState();

  return (
    createPortal((
      <div
        className={cx(classes.container, customClasses?.container, 'common__modal')}
        role="alertdialog"
        aria-modal
        {...props}
        ref={ref}
      >
        <div className={cx(classes.layout, customClasses?.layout)}>
          <div className={cx(classes.content, customClasses?.content)}>
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
