import logGroup from '../../helpers/logGroup';
import { mockedDispatch } from '../AppCommand';
import { ERROR_HANDLE_SUPPRESS } from '../../constants/ErrorHandleTypes';
import pipelineManager from '../PipelineManager';
import PipelineRequest from '../PipelineRequest';
import errorManager from '../ErrorManager';
import pipelineSequence from '../PipelineSequence';
import { PROCESS_LAST, PROCESS_SEQUENTIAL } from '../../constants/ProcessTypes';
import { ETIMEOUT } from '../../constants/Pipeline';

jest.mock('../../helpers/logGroup', () => jest.fn());

jest.mock('../ErrorManager', () => ({
  queue: jest.fn(),
}));

jest.mock('../AppCommand');

const mockedRemove = jest.fn();
const mockedAdd = jest.fn();
jest.mock('../Event', () => ({
  get removeCallback() { return mockedRemove; },
  get addCallback() { return mockedAdd; },
}));

const PIPELINE_NAME = 'TestPipeline';

/**
 * Creates a new pipeline request instance.
 * @param {string} [pipelineName=PIPELINE_NAME] Name of the request pipeline.
 * @return {Object}
 */
const createRequest = (pipelineName = PIPELINE_NAME) => new PipelineRequest(pipelineName);

describe('PipelineManager', () => {
  let request;

  beforeEach(() => {
    // Reset modules.
    pipelineSequence.constructor();
    pipelineManager.constructor();
    // Generate a request and add it to the manager. It can be used for most of the tests.
    request = createRequest();
    pipelineManager.add(request);
    jest.clearAllMocks();
  });

  describe('.constructor()', () => {
    it('should work as expected', () => {
      pipelineManager.constructor();
      expect(pipelineManager.requests.size).toBe(0);
      expect(pipelineManager.pipelines.size).toBe(0);
      expect(pipelineManager.suppressedErrors).toHaveLength(0);
    });
  });

  describe('.addSuppressedErrors()', () => {
    it('should store an error code to suppress', () => {
      const error = 1;
      pipelineManager.addSuppressedErrors(error);
      expect(pipelineManager.suppressedErrors).toHaveLength(1);
      expect(pipelineManager.suppressedErrors[0]).toBe(error);
    });

    it('should store multiple error codes to suppress', () => {
      const errors = [1, 2];
      pipelineManager.addSuppressedErrors(errors);
      expect(pipelineManager.suppressedErrors).toHaveLength(2);
      expect(pipelineManager.suppressedErrors).toEqual(errors);
    });

    it('should extend the error list with every call', () => {
      const entryOne = [1, 2];
      const entryTwo = 3;
      pipelineManager.addSuppressedErrors(entryOne);
      pipelineManager.addSuppressedErrors(entryTwo);
      expect(pipelineManager.suppressedErrors).toHaveLength(3);
      expect(pipelineManager.suppressedErrors).toEqual([1, 2, 3]);
    });
  });

  describe('.add()', () => {
    it('should add a request to the queue', () => {
      expect(pipelineManager.requests.size).toEqual(1);
      expect(pipelineManager.requests.get(request.serial).request).toBe(request);
    });

    it('should add multiple requests to the queue', () => {
      const dispatchSpy = jest.spyOn(pipelineManager, 'dispatch');
      const requestOne = request;
      const requestTwo = createRequest(`${PIPELINE_NAME}1`);

      pipelineManager.add(requestOne);
      pipelineManager.add(requestTwo);
      expect(pipelineManager.requests.size).toEqual(2);
      expect(pipelineManager.requests.get(requestOne.serial).request).toBe(requestOne);
      expect(pipelineManager.requests.get(requestTwo.serial).request).toBe(requestTwo);
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(requestOne.serial);
      expect(dispatchSpy).toHaveBeenCalledWith(requestTwo.serial);
    });
  });

  describe('.dispatch()', () => {
    it('should send a request', () => {
      const createRequestCallbackSpy = jest.spyOn(pipelineManager, 'createRequestCallback');
      const hasRunningDependenciesSpy = jest.spyOn(pipelineManager, 'hasRunningDependencies');
      const sendRequestSpy = jest.spyOn(pipelineManager, 'sendRequest');

      pipelineManager.constructor();
      const result = pipelineManager.add(request);

      expect(result).toBeInstanceOf(Promise);
      expect(createRequestCallbackSpy).toHaveBeenCalledTimes(1);
      expect(createRequestCallbackSpy).toHaveBeenCalledWith(
        request.serial,
        expect.any(Function),
        expect.any(Function)
      );
      expect(hasRunningDependenciesSpy).toHaveBeenCalledTimes(1);
      const pipelineName = pipelineManager.getPipelineNameBySerial(request.serial, false);
      expect(hasRunningDependenciesSpy).toHaveBeenCalledWith(pipelineName);
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendRequestSpy).toHaveBeenCalledWith(request.serial);
    });

    it('should not send the request when dependencies are running', () => {
      jest
        .spyOn(pipelineManager, 'hasRunningDependencies')
        .mockReturnValueOnce(true);
      const sendRequestSpy = jest.spyOn(pipelineManager, 'sendRequest');

      pipelineManager.constructor();
      pipelineManager.add(request);
      expect(sendRequestSpy).not.toHaveBeenCalled();
    });

    it('should resolve when a pipeline response comes in', () => {
      const response = { succcess: true };
      pipelineManager.constructor();
      const handler = pipelineManager.add(request);

      expect(request.callback).toBeInstanceOf(Function);
      // Simulate a pipeline response event.
      request.callback(null, request.serial, response);
      expect(handler).resolves.toEqual(response);
    });

    it('should reject when a pipeline error comes in', () => {
      const error = {
        message: 'Message',
        code: 'CODE',
      };

      const expected = new Error(error.message);
      expected.code = error.code;

      pipelineManager.constructor();
      const handler = pipelineManager.add(request);

      expect(request.callback).toBeInstanceOf(Function);
      // Simulate a pipeline response event.
      request.callback(error, request.serial);
      expect(handler).rejects.toEqual(expected);
    });
  });

  describe('.createRequestCallback()', () => {

  });

  describe('.hasRunningDependencies()', () => {

  });

  describe('.runDependencies()', () => {

  });

  describe('.handleTimeout()', () => {
    jest.useFakeTimers();

    it('should handle timeouts like expected', (done) => {
      pipelineManager.constructor();
      request.setRetries(1);
      const promise = pipelineManager.add(request);

      const entry = pipelineManager.requests.get(request.serial);
      expect(entry.retries).toBe(1);
      expect(entry.ongoing).toBe(1);

      jest.runAllTimers();

      expect(entry.retries).toBe(0);
      expect(entry.ongoing).toBe(2);

      jest.runAllTimers();

      promise.catch(({ message, code }) => {
        expect(message.includes('timed out')).toBeTruthy();
        expect(code).toBe(ETIMEOUT);
        done();
      });
    });
  });

  describe('.handleError()', () => {
    it('should ignore when error code should be suppressed', () => {
      pipelineManager.addSuppressedErrors('MY_ERROR');
      request.reject = jest.fn();
      request.error = {
        code: 'MY_ERROR',
      };

      pipelineManager.handleError(request.serial);

      expect(request.reject).toHaveBeenCalledTimes(1);
      expect(errorManager.queue).toHaveBeenCalledTimes(0);
    });

    it('should ignore when pipeline is set to ignore specific error code', () => {
      const req = createRequest(PIPELINE_NAME).setErrorBlacklist(['MY_ERROR']);
      pipelineManager.add(req);
      req.reject = jest.fn();
      req.error = {
        code: 'MY_ERROR',
      };

      pipelineManager.handleError(req.serial);

      expect(req.reject).toHaveBeenCalledTimes(1);
      expect(errorManager.queue).toHaveBeenCalledTimes(0);
    });

    it('should not queue an error when all errors are suppressed', () => {
      const req = createRequest(PIPELINE_NAME).setHandleErrors(ERROR_HANDLE_SUPPRESS);
      pipelineManager.add(req);
      req.reject = jest.fn();
      req.error = {
        code: 'MY_ERROR',
      };

      pipelineManager.handleError(req.serial);

      expect(req.reject).toHaveBeenCalledTimes(1);
      expect(errorManager.queue).toHaveBeenCalledTimes(0);
    });

    it('should call the appropriate reject()', () => {
      request.reject = jest.fn();
      request.error = {
        code: 'MY_ERROR',
      };

      pipelineManager.handleError(request.serial);

      expect(request.reject).toHaveBeenCalledTimes(1);
      expect(errorManager.queue).toHaveBeenCalledTimes(1);
    });
  });

  describe('.handleResult()', () => {

  });

  describe('.handleResultSequence()', () => {
    let requests;
    let handleResultSpy;

    beforeEach(() => {
      pipelineManager.constructor();
      pipelineSequence.constructor();

      handleResultSpy = jest.spyOn(pipelineManager, 'handleResult');

      requests = [1, 2, 3, 4].map(suffix =>
        createRequest(`${PIPELINE_NAME}${suffix}`).setResponseProcessed(PROCESS_SEQUENTIAL));
    });

    it('should handle a sequence as expected when all requests are finished', () => {
      requests.forEach((entry) => {
        pipelineManager.add(entry);
        pipelineManager.requests.get(entry.serial).finished = true;
      });

      expect(pipelineSequence.get()).toHaveLength(4);

      pipelineManager.handleResultSequence();
      expect(handleResultSpy).toHaveBeenCalledTimes(4);
      expect(pipelineSequence.get()).toHaveLength(0);
    });

    it('should handle a sequence as expected when requests are not finished in order', () => {
      requests.forEach((entry) => {
        pipelineManager.add(entry);
      });

      /* eslint-disable extra-rules/no-single-line-objects */
      const tests = [
        { index: 1, length: 4 },
        { index: 0, length: 2 },
        { index: 3, length: 2 },
        { index: 2, length: 0 },
      ];
      /* eslint-enable extra-rules/no-single-line-objects */

      tests.forEach(({ index, length }) => {
        // Set the finished flag at the requested index.
        pipelineManager.requests.get(requests[index].serial).finished = true;
        // Run the handler.
        pipelineManager.handleResultSequence();
        // Compare sequence length and handleResult() call count.
        expect(pipelineSequence.get()).toHaveLength(length);
        expect(handleResultSpy).toHaveBeenCalledTimes(requests.length - length);
      });
    });

    it('should remove abandoned serials from the sequence', () => {
      pipelineSequence.set('1337');
      pipelineSequence.set('4711');

      expect(pipelineSequence.get()).toHaveLength(2);
      pipelineManager.handleResultSequence();
      expect(pipelineSequence.get()).toHaveLength(0);
    });
  });

  describe('.sendRequest()', () => {
    beforeEach(() => {
      // Reset the manager to remove the request from the global beforeEach.
      pipelineManager.constructor();
    });

    it('should ignore invalid serial', () => {
      pipelineManager.sendRequest('1234');
      expect(logGroup).not.toHaveBeenCalled();
      expect(mockedDispatch).not.toHaveBeenCalled();
    });

    it('should dispatch a pipeline request to the app', () => {
      // Adding a new request will invoke .sendRequest(), so no explicit call is necessary.
      pipelineManager.add(request);
      const entry = pipelineManager.requests.get(request.serial);

      expect(entry.retries).toBe(request.retries);
      expect(entry.ongoing).toBe(1);
      expect(typeof entry.timer).toBe('number');
      expect(pipelineSequence.get().includes(request.serial)).toBeFalsy();
      expect(logGroup).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        name: pipelineManager.getPipelineNameBySerial(request.serial),
        serial: request.serial,
        input: {},
      });
    });

    it('should dispatch a trusted pipeline request to the app', () => {
      request.setTrusted(true);
      pipelineManager.add(request);
      expect(logGroup).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        name: pipelineManager.getPipelineNameBySerial(request.serial),
        serial: request.serial,
        input: {},
        type: 'trusted',
      });
    });

    it('should dispatch a pipeline request and add it to the sequence', () => {
      request.setResponseProcessed(PROCESS_SEQUENTIAL);
      pipelineManager.add(request);
      const entry = pipelineManager.requests.get(request.serial);

      expect(entry.retries).toBe(request.retries);
      expect(entry.ongoing).toBe(1);
      expect(typeof entry.timer).toBe('number');
      expect(pipelineSequence.get().includes(request.serial)).toBeTruthy();
      expect(logGroup).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('.addRequestToPipelineSequence()', () => {
    it('should not add a request to the pipeline sequence when it is not sequential', () => {
      pipelineManager.addRequestToPipelineSequence(request.serial);
      expect(pipelineSequence.sequence).toHaveLength(0);
    });

    it('should add a request to the pipeline sequence when it is sequential', () => {
      request.setResponseProcessed(PROCESS_SEQUENTIAL);
      pipelineManager.addRequestToPipelineSequence(request.serial);
      expect(pipelineSequence.sequence).toHaveLength(1);
      expect(pipelineSequence.sequence[0]).toBe(request.serial);
    });
  });

  describe('.removeRequestFromPiplineSequence()', () => {
    it('should remove a serial from the sequence when no matching request exists', () => {
      const serial = '1337';
      pipelineSequence.set(serial);
      expect(pipelineSequence.get()).toHaveLength(1);
      pipelineManager.removeRequestFromPiplineSequence(serial);
      expect(pipelineSequence.get()).toHaveLength(0);
    });

    it('should not remove a request from the pipeline sequence when it is not sequential', () => {
      pipelineSequence.set(request.serial);
      pipelineManager.removeRequestFromPiplineSequence(request.serial);
      expect(pipelineSequence.get()).toHaveLength(1);
    });

    it('should remove a request from the pipeline sequence when it is sequential', () => {
      request.setResponseProcessed(PROCESS_SEQUENTIAL);
      pipelineManager.addRequestToPipelineSequence(request.serial);
      expect(pipelineSequence.get()).toHaveLength(1);
      pipelineManager.removeRequestFromPiplineSequence(request.serial);
      expect(pipelineSequence.get()).toHaveLength(0);
    });
  });

  describe('.incrementRequestOngoing()', () => {
    let incrementPipelineSpy;

    beforeEach(() => {
      incrementPipelineSpy = jest.spyOn(pipelineManager, 'incrementPipelineOngoing');
    });

    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.incrementRequestOngoing('1234');
      expect(isOngoing).toBeFalsy();
      expect(incrementPipelineSpy).toHaveBeenCalledTimes(0);
    });

    it('should increment the ongoing flag', () => {
      const instance = pipelineManager.requests.get(request.serial);

      expect(instance.ongoing).toEqual(1);
      pipelineManager.incrementRequestOngoing(request.serial);
      expect(instance.ongoing).toEqual(2);
      expect(incrementPipelineSpy).toHaveBeenCalledTimes(1);
    });

    it('should not increment the ongoing flag', () => {
      pipelineManager.incrementRequestOngoing('1234');

      const instance = pipelineManager.requests.get(request.serial);
      expect(instance.ongoing).toEqual(1);
      expect(incrementPipelineSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('.decrementRequestOngoing()', () => {
    let decrementPipelineSpy;

    beforeEach(() => {
      decrementPipelineSpy = jest.spyOn(pipelineManager, 'decrementPipelineOngoing');
    });

    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.decrementRequestOngoing('1234');
      expect(isOngoing).toBeFalsy();
      expect(decrementPipelineSpy).toHaveBeenCalledTimes(0);
    });

    it('should decrement the ongoing flag', () => {
      const instance = pipelineManager.requests.get(request.serial);

      expect(instance.ongoing).toEqual(1);
      pipelineManager.decrementRequestOngoing(request.serial);
      expect(instance.ongoing).toEqual(0);
      expect(decrementPipelineSpy).toHaveBeenCalledTimes(1);
    });

    it('should not decrement the ongoing flag for an unknown request', () => {
      pipelineManager.decrementRequestOngoing('1234');

      const instance = pipelineManager.requests.get(request.serial);
      expect(instance.ongoing).toEqual(1);
      expect(decrementPipelineSpy).toHaveBeenCalledTimes(0);
    });

    it('should not decrement the ongoing flag below zero', () => {
      const instance = pipelineManager.requests.get(request.serial);
      instance.ongoing = 0;
      pipelineManager.decrementRequestOngoing(request.serial);
      expect(instance.ongoing).toEqual(0);
    });
  });

  describe('.incrementPipelineOngoing()', () => {
    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.incrementPipelineOngoing('1234');
      expect(isOngoing).toBeFalsy();
    });

    it('should increase the pipeline ongoing flag', () => {
      const { serial } = request;

      expect(pipelineManager.pipelines.get(request.name)).toBe(1);
      pipelineManager.incrementPipelineOngoing(serial);
      expect(pipelineManager.pipelines.get(request.name)).toBe(2);
    });
  });

  describe('.decrementPipelineOngoing()', () => {
    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.decrementPipelineOngoing('1234');
      expect(isOngoing).toBeFalsy();
    });

    it('should decrease the pipeline ongoing flag', () => {
      const { serial } = request;

      pipelineManager.incrementPipelineOngoing(serial);
      expect(pipelineManager.pipelines.get(request.name)).toBe(2);
      pipelineManager.decrementPipelineOngoing(serial);
      expect(pipelineManager.pipelines.get(request.name)).toBe(1);
      pipelineManager.decrementPipelineOngoing(serial);
      expect(pipelineManager.pipelines.has(request.name)).toBeFalsy();
    });
  });

  describe('.decrementRetries()', () => {
    it('should return undefined serial is invalid', () => {
      const name = pipelineManager.decrementRetries('1234');
      expect(name).toBeUndefined();
    });

    it('should reduce the number of retries by 1', () => {
      const req = createRequest(PIPELINE_NAME).setRetries(4);
      pipelineManager.add(req);

      const { serial } = req;
      const instance = pipelineManager.requests.get(serial);
      pipelineManager.decrementRetries(serial);

      expect(instance.retries).toEqual(3);
    });

    it('should not reduce the number of retries below zero', () => {
      const req = createRequest(PIPELINE_NAME).setRetries(0);
      pipelineManager.add(req);

      const { serial } = req;
      const instance = pipelineManager.requests.get(serial);
      pipelineManager.decrementRetries(serial);

      expect(instance.retries).toEqual(0);
    });

    it('should ignore an invalid serial', () => {
      const req = createRequest(PIPELINE_NAME).setRetries(4);
      pipelineManager.add(req);

      const { serial } = req;
      const instance = pipelineManager.requests.get(serial);
      pipelineManager.decrementRetries('1234');

      expect(instance.retries).toEqual(4);
    });
  });

  describe('.getPipelineNameBySerial()', () => {
    it('should return empty name when serial is invalid', () => {
      const name = pipelineManager.getPipelineNameBySerial('1234');
      expect(name).toEqual('');
    });

    it('should return the correct pipeline name', () => {
      const { serial } = request;
      const name = pipelineManager.getPipelineNameBySerial(serial);

      expect(name).toEqual(`${PIPELINE_NAME}.v${request.version}`);
    });

    it('should return a pieplie name witout version suffix', () => {
      const { serial } = request;
      const name = pipelineManager.getPipelineNameBySerial(serial, false);

      expect(name).toEqual(PIPELINE_NAME);
    });
  });

  describe('.getRetriesPrefix()', () => {
    it('should return an empty string when the request was not retried yet', () => {
      const result = pipelineManager.getRetriesPrefix(request.serial);

      expect(typeof result).toBe('string');
      expect(result).toBe('');
    });

    it('should return a string when retires already happened', () => {
      const entry = pipelineManager.requests.get(request.serial);
      entry.retries = 1;

      const result = pipelineManager.getRetriesPrefix(request.serial);
      expect(typeof result).toBe('string');
      expect(result.length > 0).toBeTruthy();
    });
  });

  describe('.isRetriesOngoing()', () => {
    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.isRetriesOngoing('1234');
      expect(isOngoing).toBeFalsy();
    });

    it('should detect an ongoing request', () => {
      const isOngoing = pipelineManager.isRetriesOngoing(request.serial);
      expect(isOngoing).toBeTruthy();
    });

    it('should return false when no retries are left', () => {
      const entry = pipelineManager.requests.get(request.serial);
      entry.retries = 0;
      const isOngoing = pipelineManager.isRetriesOngoing(request.serial);
      expect(isOngoing).toBeFalsy();
    });

    it('should return false when the request is not ongoing anymore', () => {
      const entry = pipelineManager.requests.get(request.serial);
      entry.ongoing = 0;
      const isOngoing = pipelineManager.isRetriesOngoing(request.serial);
      expect(isOngoing).toBeFalsy();
    });
  });

  describe.skip('.isProcessLastOngoing()', () => {
    it('should ignore invalid serial', () => {
      const isOngoing = pipelineManager.isProcessLastOngoing('1234');
      expect(isOngoing).toBeFalsy();
    });

    it('should be processed last', () => {
      const req = createRequest(PIPELINE_NAME).setResponseProcessed(PROCESS_LAST);

      pipelineManager.add(req);

      const instance = pipelineManager.requests.get(req.serial);
      instance.ongoing = 1;

      const isOngoing = pipelineManager.isProcessLastOngoing(req.serial);
      expect(isOngoing).toBeTruthy();
    });

    it('should not be processed last', () => {
      const isOngoing = pipelineManager.isProcessLastOngoing(request.serial);
      expect(isOngoing).toBeFalsy();
    });
  });
});
