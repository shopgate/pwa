/**
 * The react native bridge directly sends command to the app using
 * the postMessage interface.
 */
class ReactNativeBridge {
  /* eslint-disable class-methods-use-this */
  /**
   * Dispatches a single command to the dev server.
   * @param {Object} commands The commands to dispatch.
   * @param {string} versions The versions for the commands.
   */
  dispatchCommandsForVersion(commands, versions) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      commands,
      versions,
    }));
  }
  /* eslint-enable class-methods-use-this */
}

export default ReactNativeBridge;

