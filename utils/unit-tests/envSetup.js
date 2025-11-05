/* global jasmine */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc, extra-rules/potential-point-free, class-methods-use-this, no-unused-vars */

// Extend Jest matchers to add Enzyme specific ones (necessary since jest-enzyme packages was dropped)
expect.extend({
  toBeEmptyRender(received) {
    const isFn = fn => typeof fn === 'function';

    // Prefer Enzyme's API when available (shallow)
    let empty =
      isFn(received.isEmptyRender) ? received.isEmptyRender() : null;

    // Fallback: try to infer from HTML (mount / generic wrappers)
    if (empty === null) {
      const html = isFn(received.html) ? received.html() : undefined;
      empty = html == null || /^\s*$/.test(String(html));
    }

    const pass = empty === true;
    return {
      pass,
      message: () =>
        (pass
          ? 'expected wrapper NOT to be an empty render'
          : 'expected wrapper to be an empty render'),
    };
  },
  toExist(received) {
    const pass = typeof received.exists === 'function' ? received.exists() : !!received.length;
    return {
      pass,
      message: () =>
        (pass ? 'expected wrapper NOT to exist' : 'expected wrapper to exist'),
    };
  },
});

global.SGEvent = {
  __call: () => { },
};

if (jasmine) {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
}

global.mutationConstructorSpy = jest.fn();
global.mutationObserveSpy = jest.fn();
global.mutationDisconnectSpy = jest.fn();

global.MutationObserver = class {
  constructor(callback) { global.mutationConstructorSpy(callback); }

  observe(element, initObject) { global.mutationObserveSpy(element, initObject); }

  disconnect() { global.mutationDisconnectSpy(); }
};

global.IntersectionObserver = jest.fn((callback, options) => ({
  observe: jest.fn((element) => {

  }),
  unobserve: jest.fn((element) => {

  }),
  disconnect: jest.fn(() => {

  }),
  takeRecords: jest.fn(() => []),
  trigger: (entries) => {
    callback(entries, { disconnect: jest.fn(), unobserve: jest.fn() });
  },
}));

/* eslint-enable require-jsdoc, extra-rules/potential-point-free, class-methods-use-this, no-unused-vars */
/* eslint-enable max-len */
