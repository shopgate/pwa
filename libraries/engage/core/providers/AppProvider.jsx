import React, { Component } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  APP_EVENT_VIEW_DID_APPEAR,
  APP_EVENT_VIEW_DID_DISAPPEAR,
} from '@shopgate/pwa-core/constants/AppEvents';
import { event } from '../index';
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
      isForeground: true,
    };

    event.addCallback(APP_EVENT_VIEW_DID_APPEAR, this.setForeground);
    event.addCallback(APP_EVENT_VIEW_DID_DISAPPEAR, this.setBackground);
  }

  /**
   * Removes the event listeners when the component unmounts.
   */
  componentWillUnmount() {
    event.removeCallback(APP_EVENT_VIEW_DID_APPEAR, this.setForeground);
    event.removeCallback(APP_EVENT_VIEW_DID_DISAPPEAR, this.setBackground);
  }

  /**
   * Returns the context value to be passed to consumers.
   * @returns {Object}
   */
  get provided() {
    return {
      appConfig,
      isForeground: this.state.isForeground,
      setIsForeground: this.setIsForeground,
    };
  }

  /**
   * Sets the isForeground state to TRUE.
   */
  setForeground = () => {
    this.setIsForeground(true);
  }

  /**
   * Sets the isForeground state to TRUE.
   */
  setBackground = () => {
    this.setIsForeground(false);
  }

  /**
   * Sets the isForeground state.
   * @param {boolean} value The new value
   */
  setIsForeground(value) {
    this.setState({
      isForeground: value,
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
