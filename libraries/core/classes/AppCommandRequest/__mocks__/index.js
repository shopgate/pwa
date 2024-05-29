import event from '../../Event';
import logGroup from '../../../helpers/logGroup';

const AppCommandRequest = jest.requireActual('../index').default;

jest.mock('../../AppCommand');
jest.mock('../../../helpers/logGroup', () => ({
  __esModule: true,
  default: jest.fn(),
}));

/**
 * The MockedAppCommandRequest class is supposed to be used for unit tests of classes that extend
 * the AppCommandRequest class.
 *
 * It takes care that the promise that's returned by the dispatch method reliably
 * resolves / rejects after if was called. Additionally it provides a setter for the request
 * response data.
 */
class MockedAppCommandRequest extends AppCommandRequest {
  logGroupSpy = logGroup;

  /**
   * Sets mocked response data for the app command request. Due to how the underlying app event
   * system works, it supports multiple input parameters.
   * @param {...any} params Parameter list
   */
  setMockedResponse(...params) {
    this.mockedResponse = params;
  }

  /**
   * Overwrite for the dispatch method
   * @returns {Promise}
   */
  dispatch() {
    const promise = super.dispatch();

    setTimeout(() => {
      // Simulate invocation of the AppCommandRequest response callback
      event.emit(this.callbackName, this.serial, ...this.mockedResponse);
    }, 0);

    return promise;
  }
}

export default MockedAppCommandRequest;
