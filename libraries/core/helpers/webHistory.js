import { createBrowserHistory } from 'history';
import { router } from '@virtuous/conductor';
import { hasWebBridge } from '.';

/**
 * Web History
 */
class WebHistory {
  /**
   * Initializes the history module.
   * @param {Object} options History options.
   */
  constructor(options) {
    this.stack = [{ key: 'root' }];
    this.activeListeners = [];
    this.history = createBrowserHistory(options);

    this.history.listen((route, action) => {
      this.handleEvent(route, action);
    });
  }

  /**
   * Adds a new history event listener.
   * @param {Function} callback Callback.
   * @returns {Function}
   */
  addListener = (callback) => {
    this.activeListeners.push(callback);
    return () => {
      this.activeListeners = this.activeListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Sends history events to all active listeners.
   * @param {Object} route Route object.
   * @param {string} action Action that caused the event.
   */
  triggerExternalListeners = (route, action) => {
    this.activeListeners.forEach(listener => listener(route, action));
  }

  /**
   * Handles incoming history events.
   * @param {Object} route Route object.
   * @param {string} action Action that caused the event.
   */
  handleEvent = (route, action) => {
    console.warn('[a-b-c] handle native event', route, action);

    // Fill stack
    if (action === 'PUSH') {
      this.stack.push(route);
    } else if (action === 'POP') {
      this.stack.pop();
    } else if (action === 'REPLACE') {
      this.stack.pop();
      this.stack.push(route);
    }

    // When the stack is empty we simply replace to the wanted page.
    // This helps when having multiple PWA instances in the tab history.
    if (this.stack.length === 0) {
      this.stack.push(route);
      router.replace({
        pathname: route.pathname,
        state: route.state,
      });
      return;
    }

    // Trigger all external listeners.
    this.triggerExternalListeners(route, action);
  }
}

/**
 * Creates a new history handler that wraps the original app history
 * to match expected browser history with router behaviour.
 * @param {Object} params History option params.
 * @returns {Object}
 */
export const createWebHistory = (params) => {
  // Create the regular browser history that will be wrapped for web.
  if (!hasWebBridge()) {
    const browserHistory = createBrowserHistory(params);
    return browserHistory;
  }

  // Initialize new history and provide compatibility layer.
  const webHistory = new WebHistory(params);
  return {
    ...webHistory.history,
    listen: webHistory.addListener,
  };
};
