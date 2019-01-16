/**
 * Calculates the timeout from a set of live-shopping settings. The highest 'to' timestamp
 * with an active time period (that is a time span with from <= current time <= to) is
 * considered to represent the current timeout.
 * @param {Object} liveshoppings The live-shopping settings.
 * @returns {number} the unix timestamp for the timeout or null if there is no active timeout.
 */
export const getLiveshoppingTimeout = (liveshoppings) => {
  const now = Date.now();

  const result = liveshoppings.reduce((best, item) => {
    // Get the time span limits.
    const from = new Date(item.from).getTime();
    const to = new Date(item.to).getTime();

    if (from <= now && to >= now) {
      // This time span is currently active.
      return Math.max(best, to);
    }

    return best;
  }, null);

  return result;
};
