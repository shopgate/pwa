/**
 * Higher order function that creates a tracking helper.
 * The resulting function can be used to scope a given
 * tracking stream ($track) between the emits of a start$
 * and stop$ stream.
 * The tracking function (trackFn) is called everytime track$
 * emits.
 * @param {Function} subscribe The subscribe wrapper function
 * @param {Function} trackFn The tracking function
 * @returns {Function} The tracking helper
 */
const makeTracker = (subscribe, trackFn) => (start$, track$, stop$) => {
  let subscription;

  const unsubscribe = () => ( // eslint-disable-line require-jsdoc
    subscription && subscription.unsubscribe()
  );

  subscribe(start$, () => {
    unsubscribe();
    subscription = track$.subscribe(trackFn);
  });

  if (stop$) {
    subscribe(stop$, () => {
      subscription = unsubscribe();
    });
  }
};

export default makeTracker;
