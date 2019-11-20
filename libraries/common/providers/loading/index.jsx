import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import LoadingContext from './context';

/**
 * The LoadingProvider component.
 */
class LoadingProvider extends Component {
  static SET = 'loading_set';

  static RESET = 'loading_reset';

  static UNSET = 'loading_unset';

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  /**
   * Adds or increases the loading counter for a path.
   * @param {string} path The path which loads.
   */
  static setLoading(path) {
    UIEvents.emit(LoadingProvider.SET, path);
  }

  /**
   * Resets the loading counter for a path.
   * @param {string} path The path which loads.
   */
  static resetLoading(path) {
    UIEvents.emit(LoadingProvider.RESET, path);
  }

  /**
   * Decreases the loading counter for a path.
   * @param {string} path The path which loads.
   */
  static unsetLoading(path) {
    UIEvents.emit(LoadingProvider.UNSET, path);
  }

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      lastUpdate: Date.now(),
      loading: new Map(),
    };

    UIEvents.addListener(this.constructor.SET, this.setLoading);
    UIEvents.addListener(this.constructor.RESET, this.resetLoading);
    UIEvents.addListener(this.constructor.UNSET, this.unsetLoading);
  }

  /**
   * Let the component only update when the state changed.
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.lastUpdate !== nextState.lastUpdate;
  }

  /**
   * Removes the event listeners when the component unmounts.
   */
  componentWillUnmount() {
    UIEvents.removeListener(this.constructor.SET, this.setLoading);
    UIEvents.removeListener(this.constructor.RESET, this.resetLoading);
    UIEvents.removeListener(this.constructor.UNSET, this.unsetLoading);
  }

  /**
   * Returns the context value to be passed to consumers.
   * @returns {Object}
   */
  get provided() {
    return {
      setLoading: this.setLoading,
      unsetLoading: this.unsetLoading,
      isLoading: this.isLoading,
      loading: this.state.loading,
    };
  }

  /**
   * Adds or increases the loading counter for a path.
   * @param {string} path The path which loads.
   */
  setLoading = (path) => {
    const { loading } = this.state;

    if (!loading.has(path)) {
      loading.set(path, 1);
    } else {
      const current = loading.get(path);
      loading.set(path, current + 1);
    }

    this.setState({
      lastUpdate: Date.now(),
      loading,
    });
  }

  /**
   * Resets the loading counter for a path.
   * @param {string} path The path which loads.
   */
  resetLoading = (path) => {
    const { loading } = this.state;

    if (loading.has(path)) {
      loading.delete(path);
    }

    this.setState({
      lastUpdate: Date.now(),
      loading,
    });
  }

  /**
   * Decreases the loading counter for a path.
   * @param {string} path The path which loads.
   */
  unsetLoading = (path) => {
    const { loading } = this.state;

    if (loading.has(path)) {
      const current = loading.get(path);
      if (current > 1) {
        loading.set(path, current - 1);
      } else {
        loading.delete(path);
      }

      this.setState({
        lastUpdate: Date.now(),
        loading,
      });
    }
  }

  /**
   * Checks if a path is loading.
   * @param {string} path The path it inspect.
   * @return {boolean}
   */
  isLoading = (path) => {
    const { loading } = this.state;
    return loading.has(path);
  }

  /**
   * @return {JSX}
   */
  render() {
    return (
      <LoadingContext.Provider value={this.provided}>
        {this.props.children}
      </LoadingContext.Provider>
    );
  }
}

export default LoadingProvider;
