/**
 * A registry for all subscribers.
 * @type {Array}
 */
const subscriptionRegistry = [];

/**
 * A wrapper for stream$.subscribe() that gets injected into each subscriber.
 * @param {Observable} stream$ A observable stream.
 * @param {Function} subscriberFn The subscriber function.
 */
const handleSubscribers = (stream$, subscriberFn) => {
  subscriptionRegistry.push(stream$.subscribe(subscriberFn));
};

/**
 * Unsubscribes all cached subscriptions.
 */
const unsubscribe = () => {
  subscriptionRegistry
    .splice(0)
    .forEach(subscription => subscription.unsubscribe());
};

/**
 * Calls each subscriber function and passes the handleSubscribers() to it.
 * @param {Array} subscribers The subscribers from the theme.
 * @return {Function} A reference to unsubscribe().
 */
const initSubscribers = (subscribers) => {
  if (subscriptionRegistry.length) {
    unsubscribe();
  }

  subscribers.forEach(subscription => subscription(handleSubscribers));

  return unsubscribe;
};

export default initSubscribers;
