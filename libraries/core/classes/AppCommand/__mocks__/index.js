let dispatchError = false;

export const mockedSetCommandName = jest.fn();
export const mockedSetCommandParams = jest.fn();
export const mockedSetLibVersion = jest.fn();
export const mockedDispatch = jest.fn();

/**
 * Causes that the dispatch method resolves with FALSE.
 * @param {boolean} value Trigger an error or not.
 */
export const triggerDispatchError = (value = true) => {
  dispatchError = value;
};

const mockedAppCommand = jest.fn().mockImplementation(function AppCommand() {
  this.setCommandName = (...args) => {
    mockedSetCommandName(...args);
    return this;
  };
  this.setCommandParams = (...args) => {
    mockedSetCommandParams(...args);
    return this;
  };
  this.setLibVersion = (...args) => {
    mockedSetLibVersion(...args);
    return this;
  };
  this.dispatch = (...args) => {
    mockedDispatch(...args);
    const success = !dispatchError;
    dispatchError = false;
    return Promise.resolve(success);
  };

  return this;
});

export default mockedAppCommand;
