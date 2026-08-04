import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import { withTheme } from '@shopgate/engage/styles/theme/hocs/withTheme';
import ToastContext from './context';

/**
 * @typedef {Object} ToastProviderProps
 * @property {import('react').ReactNode} children
 * @property {import('@shopgate/engage/styles').Theme} theme
 */

/**
 * The ToastProvider component
 * @augments {Component<ToastProviderProps>}
 */
class ToastProvider extends Component {
  static ADD = 'toast_add';

  static FLUSH = 'toast_flush';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
    theme: PropTypes.shape().isRequired,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      toasts: [],
    };

    UIEvents.addListener(this.constructor.ADD, this.addToast);
    UIEvents.addListener(this.constructor.FLUSH, this.flushToasts);
  }

  /**
   * Removes the UIEvents listeners registered in the constructor.
   */
  componentWillUnmount() {
    UIEvents.removeListener(this.constructor.ADD, this.addToast);
    UIEvents.removeListener(this.constructor.FLUSH, this.flushToasts);
  }

  /**
   * Returns the context value to be passed to consumers. The object reference is cached and only
   * rebuilt when `toasts` changes, so consumers (Toaster → SnackBarContainer → SnackBar) don't
   * re-render on every unrelated ToastProvider render.
   * @returns {Object}
   */
  get provided() {
    if (!this.providedCache || this.providedCache.toasts !== this.state.toasts) {
      this.providedCache = {
        addToast: this.addToast,
        removeToast: this.removeToast,
        toasts: this.state.toasts,
      };
    }

    return this.providedCache;
  }

  /**
   * Adds a new, unique, toast to the list.
   * @param {Object} toast The toast object to add.
   */
  addToast = (toast) => {
    if (!toast.message) {
      return;
    }

    const nextToast = {
      id: toast.id,
      action: toast.action,
      actionLabel: toast.actionLabel,
      onLongPress: toast.onLongPress,
      message: toast.message,
      messageParams: toast.messageParams,
      duration: toast.duration || this.props.theme.transitions.duration.toast,
    };

    // Update the queue immutably: consumers rely on the array reference changing to re-render
    // (e.g. the SnackBar memoizes the currently shown toast on this reference). A toast whose id
    // is already queued replaces that entry with the new data; otherwise it is appended.
    this.setState(({ toasts }) => {
      const exists = toasts.some(({ id }) => id === toast.id);

      return {
        toasts: exists
          ? toasts.map(item => (item.id === toast.id ? nextToast : item))
          : [...toasts, nextToast],
      };
    });
  };

  /**
   * Removes the first toast from the list.
   */
  removeToast = () => {
    // Drop the first toast immutably so the array reference changes and the SnackBar advances to
    // the next queued toast (rather than re-rendering the same, now-stale, memoized toast).
    this.setState(({ toasts }) => ({ toasts: toasts.slice(1) }));
  };

  flushToasts = () => {
    if (this.state.toasts.length) {
      this.setState({ toasts: [] });
    }
  };

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <ToastContext.Provider value={this.provided}>
        {this.props.children}
      </ToastContext.Provider>
    );
  }
}

const ThemedToastProvider = withTheme(ToastProvider);

// The HOC returns a new component which doesn't carry over the statics of the wrapped class. They
// are part of the public API of this module (consumers emit UIEvents on ToastProvider.ADD), so they
// are re-attached explicitly.
ThemedToastProvider.ADD = ToastProvider.ADD;
ThemedToastProvider.FLUSH = ToastProvider.FLUSH;

export default ThemedToastProvider;
