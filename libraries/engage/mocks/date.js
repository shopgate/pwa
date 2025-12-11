const RealDate = global.Date;

/**
 * Replace the global Date with a mocked one.
 * @param {string|number} isoDate Data and time to set
 */
export function mockDate(isoDate) {
  global.Date = class extends Date {
    /**
     * Builds a new Date object with a mocked date/time value.
     */
    constructor() {
      super();
      // eslint-disable-next-line no-constructor-return
      return new RealDate(isoDate);
    }
  };
}

/**
 * Resets a previously mocked Date class back to it's original.
 */
export function resetMockDate() {
  global.Date = RealDate;
}
