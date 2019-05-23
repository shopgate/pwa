import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import ToastContext from './context';

const { variables: { toast: { duration = 5000 } = {} } = {} } = themeConfig;

/**
 * The ToastProvider component
 */
class ToastProvider extends Component {
  static ADD = 'toast_add';
  static FLUSH = 'toast_flush';

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
  }

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
   * Returns the context value to be passed to consumers.
   * @returns {Object}
   */
  get provided() {
    return {
      addToast: this.addToast,
      removeToast: this.removeToast,
      toasts: this.state.toasts,
    };
  }

  /**
   * Adds a new, unique, toast to the list.
   * @param {Object} toast The toast object to add.
   */
  addToast = (toast) => {
    if (!toast.message) {
      return;
    }

    const { toasts } = this.state;

    // Check if the toast id already is present.
    const found = toasts.find(({ id }) => toast.id === id);

    // If found, update the toast with the new data.
    if (found) {
      found.action = toast.action;
      found.actionLabel = toast.actionLabel;
      found.message = toast.message;
      found.messageParams = toast.messageParams;
      found.duration = toast.duration || duration;
    } else {
      toasts.push({
        id: toast.id,
        action: toast.action,
        actionLabel: toast.actionLabel,
        message: toast.message,
        messageParams: toast.messageParams,
        duration: toast.duration || duration,
      });
    }

    this.setState({ toasts });
  }

  /**
   * Removes the first toast from the list.
   */
  removeToast = () => {
    const { toasts } = this.state;
    toasts.shift();

    this.setState({ toasts });
  }

  flushToasts = () => {
    if (this.state.toasts.length) {
      this.setState({ toasts: [] });
    }
  }

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

export default ToastProvider;
