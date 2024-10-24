/**
 * @callback AppInitializationHandler
 * @param {Object} params
 * @param {Function} params.dispatch Redux dispatch function
 * @param {Function} params.getState Redux dispatch function
 * @returns {Promise}
 */

/**
 * Class to maintain handler functions that are executed before the React app initializes.
 *
 * Handlers are invoked before the React app initializes. They can
 * interact with Redux via "dispatch" and "getState" and e.g. initialize states based on
 * information which is retrieved via app commands.
 *
 * Since the handler execution is blocking and postpones the React app initialization, this
 * system should be handled with care.
 */
class AppInitialization {
  /**
   * Constructor
   */
  constructor() {
    this.store = new Map();
  }

  /**
   * Get an initialization handler
   * @param {*} key Identifier for the handler
   * @returns {Promise}
   */
  get(key) {
    return this.store.get(key);
  }

  /**
   * Sets an initialization handler.
   *
   * @param {*} key Identifier for the handler
   * @param {AppInitializationHandler} handler The actual handler
   * @returns {AppInitialization}
   *
   * @example
   * const handler = ({ dispatch, getState }) => {
   *  return new Promise(async (resolve) => {
   *    // Retrieve some data from the app via app command
   *    const appCommandResponse = await getAppCommandResponse();
   *    // Retrieve some data from Redux (store will be nearly empty at this point)
   *    const reduxValue = getValueFromRedux(getState());
   *    // Dispatch Redux actions to initialize a Redux state
   *    dispatch(reduxAction(reduxValue, appCommandResponse));
   *    resolve();
   * });
   *
   * appInitialization.set('handler-key', handler);
   * }
   */
  set(key, handler) {
    this.store.set(key, handler);
    return this;
  }

  /**
   * Invokes all registered handlers
   * @returns {Promise<{results: [], errors: []}>}
   */
  async initialize({ dispatch, getState }) {
    const promises = Array.from(this.store.values()).map((handler) => {
      let res;

      // Take care that errors inside handlers don't break the app
      try {
        res = handler({
          dispatch,
          getState,
        });
      } catch (e) {
        // Nothing to see here
      }

      return res;
    }).filter(Boolean);

    const results = [];
    const errors = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const promise of promises) {
      // Take care that rejecting handlers don't break the app
      try {
        // eslint-disable-next-line no-await-in-loop
        results.push(await promise);
      } catch (e) {
        errors.push(e);
      }
    }

    return {
      results,
      errors,
    };
  }
}

export default new AppInitialization();
