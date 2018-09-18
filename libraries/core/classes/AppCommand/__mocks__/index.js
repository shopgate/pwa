let dispatchError = false;

export const mockedSetCommandName = jest.fn(name => name);
export const mockedSetCommandParams = jest.fn(params => params);
export const mockedSetLibVersion = jest.fn(version => version);
export const mockedBuildCommand = jest.fn(command => command);
export const mockedDispatch = jest.fn(params => params);

/**
 * Causes that the dispatch method resolves with FALSE.
 * @param {boolean} value Trigger an error or not.
 */
export const triggerDispatchError = (value = true) => {
  dispatchError = value;
};

const mockedAppCommand = jest.fn().mockImplementation(function MockedAppCommand() {
  this.name = '';
  this.params = null;
  this.libVersion = '9.0';

  this.setCommandName = (name) => {
    this.name = mockedSetCommandName(name);
    return this;
  };

  this.setCommandParams = (params) => {
    this.params = mockedSetCommandParams(params);
    return this;
  };

  this.setLibVersion = (version) => {
    this.libVersion = mockedSetLibVersion(version);
    return this;
  };

  this.buildCommand = () => {
    const command = this.name ? {
      c: this.name,
      ...this.params && { p: this.params },
    } : null;

    return mockedBuildCommand(command);
  };

  this.dispatch = (params) => {
    mockedDispatch(params);
    const success = !dispatchError;
    dispatchError = false;
    return Promise.resolve(success);
  };

  return this;
});

export default mockedAppCommand;
