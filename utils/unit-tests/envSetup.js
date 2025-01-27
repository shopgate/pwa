/* global jasmine */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc, extra-rules/potential-point-free, class-methods-use-this, no-unused-vars */

require('jest-enzyme/lib/index');

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
