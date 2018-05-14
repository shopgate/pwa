/**
 * The Event mock is supposed to be used for tests where the event system needs to be tested.
 * Due to the structure of the original module it's not possible to spy on method calls, since
 * the spies do not call the original methods.
 */
const event = require.requireActual('../index').default;

const mockedEvent = jest.genMockFromModule('../index');

const addCallbackSpy = jest.fn();
const removeCallbackSpy = jest.fn();

mockedEvent.addCallback = (...args) => {
  addCallbackSpy(...args);
  event.addCallback(...args);
};

mockedEvent.removeCallback = (...args) => {
  removeCallbackSpy(...args);
  event.removeCallback(...args);
};

mockedEvent.call = (...args) => {
  event.call(...args);
};

mockedEvent.removeAllListeners = (...args) => {
  event.removeAllListeners(...args);
};

mockedEvent.addCallbackSpy = addCallbackSpy;
mockedEvent.removeCallbackSpy = removeCallbackSpy;

export default mockedEvent;
