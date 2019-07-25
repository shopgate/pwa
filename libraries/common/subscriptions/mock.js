/**
 * This file provides helper functions to invoke subscription callback in an easy way.
 *
 * Usage:
 * 1. Just import `subscribe` and `invoke` functions and the actual observable (stream) to be faked,
 *    as well as your subscription file.
 * 2. Then execute your main subscription function and pass the exported `subscribe` handler to it,
 *    which is exported here (e.g. within the `describe` block of your test.
 * 3. Call the subscription handlers and pass your custom parameters to it, using the `invoke`
 *    function. E.g.: `const result = invoke(appDidStart$, ({dispatch}))`
 * 4. Test the result against your expected value.
 *
 * Tips:
 * 1. If multiple subscriptions exist in your function for any given Rx observable (steam), then
 *    you can either get all results in an array, by passing `null` as third param to invoke,
 *    or you can pass an index number to only test the N-th subscription for that sream.
*  2. If you want to test multiple subscription registers, you can either `unsubscribe` or just
 *    `resetSubscriptions` before your next test run.
 * 3. To test if a particular subscription has any subscribers, just use `getSubscriptionCount` and
 *    pass your Rx observable (stream) as a parameter.
 */

// Stores all subscriptions for tests
const subscriptions = [];

/**
 * Stores the callback of each subscription to test
 * @param {Observable} stream The Rx observable to subscribe to
 * @param {Function} handler The handler function to perform an action on incoming events.
 */
export const subscribe = (stream, handler) => {
  subscriptions.push([stream, handler]);
};

/**
 * Triggers a subscription handler to be called with the given parameters.
 * @param {Observable} stream The Rx observable to invoke a call upon
 * @param {Object} params An object which contains all params to pass to the sibscription handler
 * @param {number|null} [index=0] Define which subscription it is about or leave empty to get all
 * @returns {*|[]|undefined} Returns an array of results if no index is given or one result else
 */
export const invoke = (stream, params, index = 0) => {
  const result = subscriptions
    .filter(s => s[0] === stream)
    .filter((s, i) => (index === null || i === index))
    .map(s => s[1](params));

  if (index !== null) {
    return result.length > 0 ? result[0] : undefined;
  }

  return result;
};

/**
 * Returns the count of subscriptions for the given stream or count of all subscriptions if the
 * stream param is left blank.
 * @param {Observable|null} [stream=null] The stream to get the count for or null for all.
 * @returns {number}
 */
export const getSubscriptionCount = (stream = null) => subscriptions
  .filter(s => stream === null || s[0] === stream).length;

/**
 * Removes all subscriptions from all Rx observables.
 */
export const resetSubscriptions = () => {
  subscriptions.length = 0;
};

/**
 * Removes all handlers from the given Rx observable.
 * @param {Observable} stream The Rx observable to remove all handlers for.
 * @returns {undefined}
 */
export const unsubscribe = (stream) => {
  const remainingSubscriptions = subscriptions.filter(s => s[0] !== stream);
  resetSubscriptions();
  subscribe(remainingSubscriptions);
  return undefined;
};
