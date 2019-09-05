/* eslint-disable extra-rules/no-single-line-objects */
import logGroup from '../../helpers/logGroup';
// eslint-disable-next-line import/named
import { mockedDispatch } from '../AppCommand';
import event from '../Event';
import { ERROR_HANDLE_SUPPRESS } from '../../constants/ErrorHandleTypes';
import PipelineRequest from '../PipelineRequest';
import pipelineManager from '.';
import pipelineDependencies from '../PipelineDependencies';
import errorManager from '../ErrorManager';
import pipelineSequence from '../PipelineSequence';
import { PROCESS_SEQUENTIAL, PROCESS_ALWAYS } from '../../constants/ProcessTypes';
import { ETIMEOUT } from '../../constants/Pipeline';

jest.mock('../../helpers/logGroup', () => jest.fn());

jest.mock('../ErrorManager', () => ({
  queue: jest.fn(),
}));

jest.mock('../AppCommand');

jest.mock('../Event', () => ({
  removeCallback: jest.fn(),
  addCallback: jest.fn(),
}));

const PIPELINE_NAME = 'TestPipeline';
const PIPELINE_DEPENDANT = 'PIPELINE_DEPENDANT';
const PIPELINE_DEPENDENCY = 'PIPELINE_DEPENDENCY';

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
    pipelineDependencies.constructor();
    pipelineManager.constructor();

    // Generate a request and add it to the manager. It can be used for most of the tests.
    request = createRequest();
    pipelineManager.add(request);

    pipelineDependencies.set(PIPELINE_DEPENDANT, [
      PIPELINE_DEPENDENCY,
    ]);

    jest.clearAllMocks();
  });

  afterEach(() => {
    const entry = pipelineManager.requests.get(request.serial);
    if (entry) {
      clearTimeout(entry.timer);
    }
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

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendRequestSpy).toHaveBeenCalledWith(request.serial);
    });

    it('should not send the requests when it has running dependencies', () => {
      const sendRequestSpy = jest.spyOn(pipelineManager, 'sendRequest');
      const dependant = createRequest(PIPELINE_DEPENDANT);
      const dependency = createRequest(PIPELINE_DEPENDENCY);

      pipelineManager.add(dependency);
      pipelineManager.add(dependant);

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
      expect(sendRequestSpy).toHaveBeenCalledWith(dependency.serial);
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
    const error = {
      message: 'Something went wrong',
      code: 'ERROR',
    };

    const output = {
      some: 'output',
    };

    let mockResolve;
    let mockReject;

    beforeEach(() => {
      mockResolve = jest.fn();
      mockReject = jest.fn();
    });

    it('should create a callback like expected', () => {
      pipelineManager.createRequestCallback(request.serial, mockResolve, mockReject);

      expect(request.resolve).toBe(mockResolve);
      expect(request.reject).toBe(mockReject);
      expect(request.callback).toBeInstanceOf(Function);
      expect(event.addCallback).toHaveBeenCalledTimes(1);
      expect(event.addCallback).toHaveBeenCalledWith(
        request.getEventCallbackName(),
        request.callback
      );
    });

    describe('should create a callback that invokes handleResults() for default process types', () => {
      it('should handle the output', () => {
        const handleResultSpy = jest.spyOn(pipelineManager, 'handleResult');
        request.setResponseProcessed(PROCESS_ALWAYS);
        pipelineManager.createRequestCallback(request.serial, mockResolve, mockReject);

        request.callback(null, request.serial, output);
        expect(handleResultSpy).toHaveBeenCalledTimes(1);
        expect(handleResultSpy).toHaveBeenCalledWith(request.serial);
        expect(request.error).toEqual(null);
        expect(request.output).toEqual(output);
      });

      it('should handle the error', () => {
        const handleResultSpy = jest.spyOn(pipelineManager, 'handleResult');
        request.setResponseProcessed(PROCESS_ALWAYS);
        pipelineManager.createRequestCallback(request.serial, mockResolve, mockReject);

        pipelineManager.createRequestCallback(request.serial, mockResolve, mockReject);
        request.callback(error, request.serial, {});
        expect(handleResultSpy).toHaveBeenCalledTimes(1);
        expect(handleResultSpy).toHaveBeenCalledWith(request.serial);
        expect(request.error).toEqual(error);
        expect(request.output).toEqual({});
      });
    });

    describe('should create a callback that invokes handleResults() for sequential process types', () => {
      it('should handle the output', () => {
        const handleResultSequenceSpy = jest.spyOn(pipelineManager, 'handleResultSequence');
        request.setResponseProcessed(PROCESS_SEQUENTIAL);
        pipelineManager.createRequestCallback(request.serial, mockResolve, mockReject);

        request.callback(null, request.serial, output);
        expect(handleResultSequenceSpy).toHaveBeenCalledTimes(1);
        expect(request.error).toEqual(null);
        expect(request.output).toEqual(output);
      });

      it('should handle the error', () => {
        const handleResultSequenceSpy = jest.spyOn(pipelineManager, 'handleResultSequence');
        request.setResponseProcessed(PROCESS_SEQUENTIAL);
        pipelineManager.createRequestCallback(request.serial, mockResolve, mockReject);

        pipelineManager.createRequestCallback(request.serial, mockResolve, mockReject);
        request.callback(error, request.serial, {});
        expect(handleResultSequenceSpy).toHaveBeenCalledTimes(1);
        expect(request.error).toEqual(error);
        expect(request.output).toEqual({});
      });
    });
  });

  describe('.hasRunningDependencies()', () => {
    it('should return true if dependencies are running', () => {
      const dependant = createRequest(PIPELINE_DEPENDANT);
      const dependency = createRequest(PIPELINE_DEPENDENCY);

      pipelineManager.add(dependant);
      pipelineManager.add(dependency);

      expect(pipelineManager.hasRunningDependencies(dependant.name)).toBe(true);
    });

    it('should return false if no dependencies are running', () => {
      const dependency = createRequest(PIPELINE_DEPENDENCY);
      pipelineManager.add(dependency);

      expect(pipelineManager.hasRunningDependencies(dependency.name)).toBe(false);
    });
  });

  describe('.handleDeferredRequests', () => {
    it('should send deferred requests when their dependencies are finished', () => {
      const sendRequestSpy = jest.spyOn(pipelineManager, 'sendRequest');
      const dependant = createRequest(PIPELINE_DEPENDANT);
      const dependencyOne = createRequest(PIPELINE_DEPENDENCY);
      const dependencyTwo = createRequest(PIPELINE_DEPENDENCY);

      pipelineManager.add(dependencyOne);
      pipelineManager.add(dependencyTwo);
      pipelineManager.add(dependant);

      const entryOne = pipelineManager.requests.get(dependencyOne.serial);
      const entryTwo = pipelineManager.requests.get(dependencyTwo.serial);

      // Two times called for the depencencies.
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenCalledWith(entryOne.request.serial);
      expect(sendRequestSpy).toHaveBeenCalledWith(entryTwo.request.serial);

      pipelineManager.handleDeferredRequests();
      // Call count didn't change, since dependencies are still running.
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);

      entryOne.request.callback(null, entryOne.request.serial);
      pipelineManager.handleDeferredRequests();
      // Call count didn't change, since one dependency is still running.
      expect(sendRequestSpy).toHaveBeenCalledTimes(2);

      entryTwo.request.callback(null, entryTwo.request.serial);
      pipelineManager.handleDeferredRequests();
      expect(sendRequestSpy).toHaveBeenCalledTimes(3);
      expect(sendRequestSpy).toHaveBeenCalledWith(dependant.serial);
    });
  });

  describe('.handleTimeout()', () => {
    jest.useFakeTimers();

    it('should handle timeouts like expected', (done) => {
      pipelineManager.constructor();
      request.setRetries(1);
      const promise = pipelineManager.add(request);

      const entry = pipelineManager.requests.get(request.serial);
      expect(entry.retries).toBe(1);

      jest.runAllTimers();

      expect(entry.retries).toBe(0);

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
    beforeEach(() => {
      pipelineManager.constructor();
      request = createRequest().setResponseProcessed(PROCESS_SEQUENTIAL);
      pipelineManager.add(request);
      request.resolve = jest.fn();
      request.reject = jest.fn();
      logGroup.mockClear();
    });

    it('should work as expected for successful requests', () => {
      request.output = { request: 'output' };

      expect(pipelineSequence.get()[0]).toBe(request.serial);
      expect(pipelineManager.pipelines.get(request.name)).toBe(1);

      pipelineManager.handleResult(request.serial);
      expect(pipelineManager.pipelines.has(request.name)).toBe(false);
      expect(request.resolve).toHaveBeenCalledWith(request.output);
      expect(logGroup).toHaveBeenCalledTimes(1);
      expect(event.removeCallback).toHaveBeenCalledTimes(1);
      expect(event.removeCallback).toHaveBeenCalledWith(
        request.getEventCallbackName(),
        request.callback
      );

      expect(pipelineSequence.get()).toHaveLength(0);
      expect(pipelineManager.requests.size).toBe(0);
    });

    it('should work as expected for erroneous requests', () => {
      request.error = { message: 'Error', code: 'ERROR' };
      const error = new Error(request.error.message);
      error.code = request.error.code;

      expect(pipelineSequence.get()[0]).toBe(request.serial);
      expect(pipelineManager.pipelines.get(request.name)).toBe(1);

      pipelineManager.handleResult(request.serial);
      expect(pipelineManager.pipelines.has(request.name)).toBe(false);
      expect(request.reject).toHaveBeenCalledWith(error);
      expect(logGroup).toHaveBeenCalledTimes(1);
      expect(event.removeCallback).toHaveBeenCalledTimes(1);
      expect(event.removeCallback).toHaveBeenCalledWith(
        request.getEventCallbackName(),
        request.callback
      );

      expect(pipelineSequence.get()).toHaveLength(0);
      expect(pipelineManager.requests.size).toBe(0);
    });
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

      const tests = [
        { index: 1, length: 4 },
        { index: 0, length: 2 },
        { index: 3, length: 2 },
        { index: 2, length: 0 },
      ];

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
});
/* eslint-enable extra-rules/no-single-line-objects */
