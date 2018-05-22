import pipelineManager from '../PipelineManager';
import PipelineRequest from '../PipelineRequest';
import { PROCESS_LAST } from '../../constants/ProcessTypes';

const mockedLogGroup = jest.fn();
// eslint-disable-next-line extra-rules/potential-point-free
jest.mock('../../helpers/logGroup', () => function logGroup(...args) {
  mockedLogGroup(...args);
});

jest.mock('../AppCommand', () => require.requireActual('../AppCommand/__mocks__/index').default);

const mockedRemove = jest.fn();
const mockedAdd = jest.fn();
jest.mock('../Event', () => ({
  get removeCallback() { return mockedRemove; },
  get addCallback() { return mockedAdd; },
}));

const PIPELINE_NAME = 'TestPipeline';
let request;

describe('PipelineManager', () => {
  beforeEach(() => {
    request = new PipelineRequest(PIPELINE_NAME);
  });

  afterEach(() => {
    pipelineManager.constructor();
    jest.restoreAllMocks();
  });

  describe('add()', () => {
    it('should add a request to the queue', () => {
      pipelineManager.add(request);
      expect(pipelineManager.requests.size).toEqual(1);
    });

    it('should add multiple requests to the queue', () => {
      pipelineManager.add(request);
      pipelineManager.add(new PipelineRequest(`${PIPELINE_NAME}1`));
      expect(pipelineManager.requests.size).toEqual(2);
    });
  });

  describe('addSuppressedErrors()', () => {
    it('should store an error code to suppress', () => {
      pipelineManager.addSuppressedErrors(1);
      expect(pipelineManager.suppressedErrors).toHaveLength(1);
    });

    it('should store multiple error codes to suppress', () => {
      pipelineManager.addSuppressedErrors([1, 2]);
      expect(pipelineManager.suppressedErrors).toHaveLength(2);
    });
  });

  describe('dispatch()', () => {
    beforeEach(() => {
      pipelineManager.constructor();
    });

    it('it should create callback', () => {
      pipelineManager.add(request);
      expect(request.callbackName).toEqual(`pipelineResponse:${request.serial}`);
      expect(typeof request.callback).toBe('function');
    });

    it('should sendRequest', () => {
      mockedRemove.mockClear();
      mockedAdd.mockClear();

      request.setTimeout(1);
      pipelineManager.add(request);
      const { serial } = request.serial;
      request.callback(null, jest.fn(), jest.fn());

      const requestCheck = pipelineManager.requests.get(serial);
      expect(mockedAdd).toHaveBeenCalledTimes(1);
      expect(mockedRemove).toHaveBeenCalledTimes(2);
      expect(requestCheck).toBeFalsy();
    });

    it('should set up a timeout handler - fail', (done) => {
      mockedRemove.mockClear();
      mockedAdd.mockClear();
      request.reject = jest.fn();

      request.setTimeout(1);
      pipelineManager.add(request).then(() => {
        done('should not succedd');
      }).catch(() => {
        expect(mockedAdd).toHaveBeenCalled();
        expect(mockedRemove).toHaveBeenCalled();
        expect(pipelineManager.requests.size).toBe(0);
        done();
      });

      setTimeout(() => {
        request.callback({ code: 'Fail', message: 'Fail' }, jest.fn(), jest.fn());
      }, 4);
    });

    it('should handle sequential', () => {
      request.setTimeout(1);
      request.process = 'PROCESS_SEQUENTIAL';
      request.reject = jest.fn();
      request.resolve = jest.fn();
      pipelineManager.add(request);

      expect(pipelineManager.requests.size).toBe(1);
      pipelineManager.handleResultSequence(request.serial);
      expect(pipelineManager.requests.size).toBe(0);
    });
  });

  describe('handleError()', () => {
    // Test to stop when suppressed errors are there
    // Check error manager for an entry
    // Test if reject is called

    it('should ignore when error code should be suppressed', () => {
      const mock = jest.fn();
      pipelineManager.add(request);
      pipelineManager.addSuppressedErrors('MY_ERROR');
      request.reject = mock;
      request.error = {
        code: 'MY_ERROR',
      };

      pipelineManager.handleError(request.serial);

      expect(request.reject).toHaveBeenCalledTimes(1);
    });

    it('should ignore when pipeline is set to ignore specific error code', () => {
      const mock = jest.fn();
      const req = new PipelineRequest(PIPELINE_NAME).setErrorBlacklist(['MY_ERROR']);
      pipelineManager.add(req);
      req.reject = mock;
      req.error = {
        code: 'MY_ERROR',
      };

      pipelineManager.handleError(req.serial);

      expect(req.reject).toHaveBeenCalledTimes(1);
    });

    it('should call the appropriate reject()', () => {
      const mock = jest.fn();
      pipelineManager.add(request);
      request.reject = mock;
      request.error = {
        code: 'MY_ERROR',
      };

      pipelineManager.handleError(request.serial);

      expect(request.reject).toHaveBeenCalledTimes(1);
    });
  });

  describe('incrementOngoing()', () => {
    it('should increment the ongoing flag', () => {
      pipelineManager.add(request);
      pipelineManager.incrementOngoing(request.serial);

      const instance = pipelineManager.requests.get(request.serial);
      expect(instance.ongoing).toEqual(2);
    });

    it('should not increment the ongoing flag', () => {
      pipelineManager.add(request);
      pipelineManager.incrementOngoing('1234');

      const instance = pipelineManager.requests.get(request.serial);
      expect(instance.ongoing).toEqual(1);
    });
  });

  describe('decrementOngoing()', () => {
    it('should decrement the ongoing flag', () => {
      pipelineManager.add(request);
      pipelineManager.decrementOngoing(request.serial);

      const instance = pipelineManager.requests.get(request.serial);
      expect(instance.ongoing).toEqual(0);
    });

    it('should not decrement the ongoing flag', () => {
      pipelineManager.add(request);
      pipelineManager.decrementOngoing('1234');

      const instance = pipelineManager.requests.get(request.serial);
      expect(instance.ongoing).toEqual(1);
    });
  });

  describe('decrementRetries()', () => {
    it('should reduce the number of retries by 1', () => {
      const req = new PipelineRequest(PIPELINE_NAME).setRetries(4);
      pipelineManager.add(req);

      const { serial } = req;
      const instance = pipelineManager.requests.get(serial);
      pipelineManager.decrementRetries(serial);

      expect(instance.retries).toEqual(3);
    });

    it('should ignore an invalid serial', () => {
      const req = new PipelineRequest(PIPELINE_NAME).setRetries(4);
      pipelineManager.add(req);

      const { serial } = req;
      const instance = pipelineManager.requests.get(serial);
      pipelineManager.decrementRetries('1234');

      expect(instance.retries).toEqual(4);
    });
  });

  describe('getPipelineNameBySerial()', () => {
    it('should return the correct pipeline name', () => {
      pipelineManager.add(request);

      const { serial } = request;
      const name = pipelineManager.getPipelineNameBySerial(serial);

      expect(name).toEqual(`${PIPELINE_NAME}.v1`);
    });

    it('should return empty name when serial is invalid', () => {
      const name = pipelineManager.getPipelineNameBySerial('1234');
      expect(name).toEqual('');
    });
  });

  describe('isRetriesOngoing()', () => {
    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.isRetriesOngoing('1234');
      expect(isOngoing).toBeFalsy();
    });

    it('should detect an ongoing request', () => {
      pipelineManager.add(request);
      const isOngoing = pipelineManager.isRetriesOngoing(request.serial);
      expect(isOngoing).toBeTruthy();
    });
  });

  describe('isProcessLastOngoing()', () => {
    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.isProcessLastOngoing('1234');
      expect(isOngoing).toBeFalsy();
    });

    it('should be processed last', () => {
      const req = new PipelineRequest(PIPELINE_NAME).setResponseProcessed(PROCESS_LAST);

      pipelineManager.add(req);

      const instance = pipelineManager.requests.get(req.serial);
      instance.ongoing = true;

      const isOngoing = pipelineManager.isProcessLastOngoing(req.serial);
      expect(isOngoing).toBeTruthy();
    });

    it('should not be processed last', () => {
      pipelineManager.add(request);
      const isOngoing = pipelineManager.isProcessLastOngoing(request.serial);
      expect(isOngoing).toBeFalsy();
    });
  });
});
