/* global SGJavascriptBridge */
import { useBrowserConnector, hasSGJavaScriptBridge } from '../../helpers';
import BrowserConnector from '../BrowserConnector';
import DevServerBridge from '../DevServerBridge';

/**
 * Creates a new Javascript Bridge for App Commands
 * based on the device's capabilities.
 */
class Bridge {
  /**
   * Initializes the Bridge.
   */
  constructor() {
    if (useBrowserConnector()) {
      this.bridge = new BrowserConnector();
    } else if (hasSGJavaScriptBridge()) {
      this.bridge = SGJavascriptBridge;
    } else {
      this.bridge = new DevServerBridge();
    }
  }

  /**
   * Dispatches an app command to the native app wrapper.
   * @param {Object} command The app command to dispatch.
   * @param {string} libVersion The command's lib version.
   */
  dispatchCommand(command, libVersion) {
    if ('dispatchCommandForVersion' in this.bridge) {
      this.bridge.dispatchCommandForVersion(command, libVersion);
      /* istanbul ignore else */
    } else if ('dispatchCommandsForVersion' in this.bridge) {
      this.bridge.dispatchCommandsForVersion([command], libVersion);
    } else {
      this.bridge.dispatchCommandsStringForVersion(
        JSON.stringify([command]),
        libVersion
      );
    }
  }
}

export default Bridge;
