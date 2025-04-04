import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ConnectedReactPortal, MODAL_EVENTS } from '@shopgate/engage/components';
import { UIEvents } from '@shopgate/engage/core';
import classNames from 'classnames';
import styles from './style';

let activeModals = 0;

/**
 * The Modal component.
 * @param {Object} props The component props.
 * @param {boolean} props.disableA11YFocusHandling Whether the internal A11Y focus handling
 * should be disabled since it's already handled outside the dialog.
 * @returns {JSX.Element}
 */
const Modal = ({
  children, classes, disableA11YFocusHandling,
}) => {
  useEffect(() => {
    if (disableA11YFocusHandling) {
      return null;
    }

    activeModals += 1;

    // Create a MutationObserver to watch for changes in the DOM. We need to dispatch an UI event
    // when the modal is shown, so that the main content is hidden from screen readers.
    const observer = new MutationObserver(() => {
      const target = document.querySelector('.engage__view');

      if (target) {
        // Dispatch an UI event to hide the main content from screen readers.
        UIEvents.emit(MODAL_EVENTS.SHOW);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      activeModals -= 1;

      if (activeModals <= 0) {
        // Dispatch an UI event to make the main content visible for screen readers again.
        UIEvents.emit(MODAL_EVENTS.HIDE);
      }
    };
  }, [disableA11YFocusHandling]);

  return (
    <ConnectedReactPortal isOpened>
      <div
        className={classNames(styles.container, classes?.container, 'common__modal')}
        role="alertdialog"
        aria-modal
      >
        <div className={classNames(styles.layout, classes?.layout)}>
          <div className={classNames(styles.content, classes?.content)}>
            {children}
          </div>
        </div>
      </div>
    </ConnectedReactPortal>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.shape({
    container: PropTypes.string,
    layout: PropTypes.string,
    content: PropTypes.string,
  }),
  disableA11YFocusHandling: PropTypes.bool,
};

Modal.defaultProps = {
  children: null,
  disableA11YFocusHandling: false,
  classes: {
    container: '',
    layout: '',
    content: '',
  },
};

export default Modal;
