import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  APP_EVENT_VIEW_WILL_APPEAR,
  APP_EVENT_VIEW_WILL_DISAPPEAR,
} from '@shopgate/engage/core/constants';
import { getModalCount } from '@shopgate/engage/a11y/selectors';
import { event } from '@shopgate/engage/core/classes';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import { MODAL_EVENTS } from '@shopgate/engage/components';
import AppContext from '../contexts/AppContext';

/**
 * Helper function to dispatch an event that informs the app that a modal is shown.
 * In that case the main content will be hidden from screen readers.
 */
const dispatchShowModal = () => {
  if (document.querySelector('.engage__view')) {
    UIEvents.emit(MODAL_EVENTS.SHOW);
  }
};
/**
 * The AppProvider component.
 * @param {Object} props The component props.
 * @param {React.ReactChildren} props.children The component children.
 * @returns {JSX.Element}
 */
const AppProvider = ({ children }) => {
  // State that indicates if the app is visible or not.
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Callback that sets the app visibility to true when the view appears.
   */
  const handleViewWillAppear = useCallback(() => {
    setIsVisible(true);
  }, []);

  /**
   * Callback that sets the app visibility to false when the view disappears.
   */
  const handleViewWillDisappear = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Register the event listeners for view appearance and disappearance.
  useEffect(() => {
    event.addCallback(APP_EVENT_VIEW_WILL_APPEAR, handleViewWillAppear);
    event.addCallback(APP_EVENT_VIEW_WILL_DISAPPEAR, handleViewWillDisappear);

    return () => {
      event.removeCallback(APP_EVENT_VIEW_WILL_APPEAR, handleViewWillAppear);
      event.removeCallback(APP_EVENT_VIEW_WILL_DISAPPEAR, handleViewWillDisappear);
    };
  }, [handleViewWillDisappear, handleViewWillAppear]);

  // Determine if currently modals are open
  const openModalsCount = useSelector(getModalCount);

  useEffect(() => {
    if (openModalsCount <= 0) return undefined;

    if (document.querySelector('.engage__view')) {
      // Dispatch the event to hide the main content from screen readers when a view is present.
      dispatchShowModal();
    }

    // Create a MutationObserver to watch for changes in the DOM. We need to dispatch an UI event
    // when the modal is shown, so that the main content is hidden from screen readers.
    const observer = new MutationObserver(() => {
      if (document.querySelector('.engage__view')) {
        // Dispatch the event to hide the main content from screen readers when new views are added.
        dispatchShowModal();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [openModalsCount]);

  useEffect(() => {
    if (openModalsCount === 0) {
      // Dispatch the event to show the main content when no modals are present anymore.
      UIEvents.emit(MODAL_EVENTS.HIDE);
    }
  }, [openModalsCount]);

  const value = useMemo(() => ({
    isVisible,
    appConfig,
    setIsVisible,
  }), [isVisible]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
