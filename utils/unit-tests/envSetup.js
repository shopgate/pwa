/* global jasmine */
/* eslint-disable require-jsdoc, extra-rules/potential-point-free, class-methods-use-this */

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
/* eslint-enable require-jsdoc, extra-rules/potential-point-free, class-methods-use-this */
