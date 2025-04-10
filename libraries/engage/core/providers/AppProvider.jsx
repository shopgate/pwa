import React, { Component } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  APP_EVENT_VIEW_WILL_APPEAR,
  APP_EVENT_VIEW_WILL_DISAPPEAR,
} from '@shopgate/pwa-core/constants/AppEvents';
import event from '@shopgate/pwa-core/classes/Event';
import AppContext from '../contexts/AppContext';

/**
 * The AppProvider component.
 */
class AppProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isVisible: true,
    };

    event.addCallback(APP_EVENT_VIEW_WILL_APPEAR, this.setVisible);
    event.addCallback(APP_EVENT_VIEW_WILL_DISAPPEAR, this.setHidden);
  }

  /**
   * Removes the event listeners when the component unmounts.
   */
  componentWillUnmount() {
    event.removeCallback(APP_EVENT_VIEW_WILL_APPEAR, this.setVisible);
    event.removeCallback(APP_EVENT_VIEW_WILL_DISAPPEAR, this.setHidden);
  }

  /**
   * Returns the context value to be passed to consumers.
   * @returns {Object}
   */
  get provided() {
    return {
      appConfig,
      isVisible: this.state.isVisible,
      setIsVisible: this.setIsVisible,
    };
  }

  /**
   * Sets the isVisible state to TRUE.
   */
  setVisible = () => {
    this.setIsVisible(true);
  }

  /**
   * Sets the isVisible state to TRUE.
   */
  setHidden = () => {
    this.setIsVisible(false);
  }

  /**
   * Sets the isVisible state. It indicates if Engage is visible,
   * or another WebView is presented to the user.
   * @param {boolean} value The new value
   */
  setIsVisible(value) {
    this.setState({
      isVisible: value,
    });
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <AppContext.Provider value={this.provided}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
