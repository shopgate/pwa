// Mock some underlying classes to avoid faulty code exection.
jest.mock('../../DevServerBridge', () => { });
jest.mock('../../../commands/getWebStorageEntry', () => { });

// List of known "private" methods within the original class.
const privateMethods = ['constructor', 'logCommand'];

describe('AppCommand mock', () => {
  describe('check if the mock provides all "public" methods', () => {
    const OriginalAppCommand = require.requireActual('../index').default;
    const MockedAppCommand = require.requireMock('../index').default;

    // Collect the "public" methods from the original class.
    const publicMethods = Object.getOwnPropertyNames(OriginalAppCommand.prototype)
      .filter(method => !privateMethods.includes(method));

    // To access the methods of the mock, an instance is necessary.
    const mockedInstance = new MockedAppCommand();

    publicMethods.forEach((method) => {
      it(`should contain a method called ${method}`, () => {
        expect(typeof mockedInstance[method]).toBe('function');
      });
    });
  });
});
