/**
 * Mock for @shopgate/pwa-core/classes/AppCommand.
 *
 * The published packages don't contain their __mocks__ folders, so consumers like extensions can't
 * rely on the manual mock of the package itself. Without a chainable mock the app commands that
 * are dispatched on module level - e.g. by the Scanner class - throw as soon as a component from
 * @shopgate/engage is imported.
 */
let dispatchError = false;

const mockedSetCommandName = jest.fn(name => name);
const mockedSetCommandParams = jest.fn(params => params);
const mockedSetLibVersion = jest.fn(version => version);
const mockedBuildCommand = jest.fn(command => command);
const mockedDispatch = jest.fn(params => params);

/**
 * Causes that the dispatch method resolves with FALSE.
 * @param {boolean} value Trigger an error or not.
 */
const triggerDispatchError = (value = true) => {
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

module.exports = {
  __esModule: true,
  default: mockedAppCommand,
  mockedSetCommandName,
  mockedSetCommandParams,
  mockedSetLibVersion,
  mockedBuildCommand,
  mockedDispatch,
  triggerDispatchError,
};
