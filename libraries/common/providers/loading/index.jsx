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

    this.loading = {};
    this.state = { loading: {} };

    UIEvents.addListener(this.constructor.SET, this.setLoading);
    UIEvents.addListener(this.constructor.RESET, this.resetLoading);
    UIEvents.addListener(this.constructor.UNSET, this.unsetLoading);
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
   * Adds or increases the loading counter for a path.
   * @param {string} path The path which loads.
   */
  setLoading = (path) => {
    const { loading } = this;

    const newLoading = {
      ...loading,
      [path]: loading[path] ? loading[path] + 1 : 1,
    };

    // Immediately updates state due to multiple sets before actual rerender.
    this.loading = newLoading;
    this.setState({
      loading: newLoading,
    });
  }

  /**
   * Resets the loading counter for a path.
   * @param {string} path The path which loads.
   */
  resetLoading = (path) => {
    const { [path]: removedPath, ...remaining } = this.loading;

    // Immediately updates state due to multiple sets before actual rerender.
    this.loading = remaining;
    this.setState({
      loading: remaining,
    });
  }

  /**
   * Decreases the loading counter for a path.
   * @param {string} path The path which loads.
   */
  unsetLoading = (path) => {
    const { loading } = this;

    if (typeof loading[path] === 'undefined') {
      return;
    }

    if (loading[path] <= 1) {
      this.resetLoading(path);
      return;
    }

    const newLoading = {
      ...loading,
      [path]: loading[path] - 1,
    };

    // Immediately updates state due to multiple sets before actual rerender.
    this.loading = newLoading;
    this.setState({
      loading: newLoading,
    });
  }

  /**
   * Checks if a path is loading.
   * @param {string} path The path it inspect.
   * @return {boolean}
   */
  isLoading = (path) => {
    const { loading } = this.state;
    return !!loading[path];
  }

  /**
   * @return {JSX}
   */
  render() {
    const value = {
      loading: this.state.loading,
      setLoading: this.setLoading,
      unsetLoading: this.unsetLoading,
      isLoading: this.isLoading,
    };

    return (
      <LoadingContext.Provider value={value}>
        {this.props.children}
      </LoadingContext.Provider>
    );
  }
}

export default LoadingProvider;
