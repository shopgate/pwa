import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  APP_EVENT_VIEW_WILL_APPEAR,
  APP_EVENT_VIEW_WILL_DISAPPEAR,
} from '@shopgate/engage/core/constants';
import { event } from '@shopgate/engage/core/classes';
import AppContext from '../contexts/AppContext';

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
