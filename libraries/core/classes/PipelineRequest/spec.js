import PipelineRequest, {
  DEFAULT_VERSION,
  DEFAULT_RETRIES,
  DEFAULT_MAX_RETRIES,
  DEFAULT_INPUT,
  DEFAULT_TIMEOUT,
  DEFAULT_MAX_TIMEOUT,
  DEFAULT_PROCESSED,
  DEFAULT_HANDLE_ERROR,
} from '.';
import * as processTypes from '../../constants/ProcessTypes';
import * as errorHandleTypes from '../../constants/ErrorHandleTypes';

let request;

describe('PipelineRequest', () => {
  beforeEach(() => {
    request = new PipelineRequest('testPipeline');
  });

  it('should throw if no pipeline name is set', (done) => {
    try {
      // eslint-disable-next-line no-new
      new PipelineRequest();
      done('Did not throw');
    } catch (e) {
      done();
    }
  });

  it('should be instanciatable', () => {
    expect(request instanceof PipelineRequest).toBe(true);
  });

  it('has a default version', () => {
    expect(request.version).toEqual(DEFAULT_VERSION);
  });

  it('has a default input', () => {
    expect(request.input).toEqual(DEFAULT_INPUT);
  });

  it('has trusted set to false by default', () => {
    expect(request.trusted).toEqual(false);
  });

  it('has a default retries', () => {
    expect(request.retries).toEqual(DEFAULT_RETRIES);
  });

  it('has a default timeout', () => {
    expect(request.timeout).toEqual(DEFAULT_TIMEOUT);
  });

  it('has a default process handling', () => {
    expect(request.process).toEqual(DEFAULT_PROCESSED);
  });

  it('has a default error handling', () => {
    expect(request.handleErrors).toEqual(DEFAULT_HANDLE_ERROR);
  });

  describe('setVersion()', () => {
    it('should throw if input is not a number', (done) => {
      try {
        request.setVersion('a string');
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if it is a negative number', (done) => {
      try {
        request.setVersion(-1);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if the value is 0', (done) => {
      try {
        request.setVersion(0);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should set to default if no parameter supplied', () => {
      request.setVersion();
      expect(request.version).toEqual(DEFAULT_VERSION);
    });

    it('should set the new timeout', () => {
      request.setVersion(2);
      expect(request.version).toEqual(2);
    });

    it('should return a class instance', () => {
      const value = request.setVersion(2);
      expect(value instanceof PipelineRequest).toEqual(true);
    });
  });

  describe('setInput()', () => {
    it('should throw if input is a string', (done) => {
      try {
        request.setInput('some input');
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input is a number', (done) => {
      try {
        request.setInput(123);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input is an array', (done) => {
      try {
        request.setInput(['some value']);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should set to default if no parameter supplied', () => {
      request.setInput();
      expect(request.input).toEqual(DEFAULT_INPUT);
    });

    it('should set the new input', () => {
      const input = { someKey: 'someValue' };
      request.setInput(input);
      expect(request.input).toEqual(input);
    });

    it('should return a class instance', () => {
      const value = request.setInput();
      expect(value instanceof PipelineRequest).toEqual(true);
    });
  });

  describe('setTrusted()', () => {
    it('is false by default', () => {
      expect(request.trusted).toEqual(false);
    });

    it('should set it to true', () => {
      request.setTrusted();
      expect(request.trusted).toEqual(true);
    });
  });

  describe('setRetries()', () => {
    it('should throw if input it not a number', (done) => {
      try {
        request.setRetries('a string');
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if its a negative number', (done) => {
      try {
        request.setRetries(-1);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if the value is above max', (done) => {
      try {
        request.setRetries(DEFAULT_MAX_RETRIES + 1);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should set to default if no parameter supplied', () => {
      request.setRetries();
      expect(request.retries).toEqual(DEFAULT_RETRIES);
    });

    it('should set the new retries amount', () => {
      request.setRetries(3);
      expect(request.retries).toEqual(3);
    });

    it('should return a class instance', () => {
      const value = request.setRetries(2);
      expect(value instanceof PipelineRequest).toEqual(true);
    });
  });

  describe('setTimeout()', () => {
    it('should throw if input it not a number', (done) => {
      try {
        request.setTimeout('a string');
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if its a negative number', (done) => {
      try {
        request.setTimeout(-1);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if the value is above max', (done) => {
      try {
        request.setTimeout(DEFAULT_MAX_TIMEOUT + 1000);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should set to default if no parameter supplied', () => {
      request.setTimeout();
      expect(request.timeout).toEqual(DEFAULT_TIMEOUT);
    });

    it('should set the new timeout', () => {
      request.setTimeout(2000);
      expect(request.timeout).toEqual(2000);
    });

    it('should return a class instance', () => {
      const value = request.setTimeout(2);
      expect(value instanceof PipelineRequest).toEqual(true);
    });
  });

  describe('setResponseProcessed()', () => {
    it('should throw if input is a number', (done) => {
      try {
        request.setResponseProcessed(123);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input is an array', (done) => {
      try {
        request.setResponseProcessed(['some value']);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input is an object', (done) => {
      try {
        request.setResponseProcessed({ someKey: 'someValue' });
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input not one of the possible values', (done) => {
      try {
        request.setResponseProcessed('SOME_WEIRD_THING');
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should set to default if no parameter supplied', () => {
      request.setResponseProcessed();
      expect(request.process).toEqual(DEFAULT_PROCESSED);
    });

    it('should set the new process', () => {
      request.setResponseProcessed(processTypes.PROCESS_LAST);
      expect(request.process).toEqual(processTypes.PROCESS_LAST);
    });

    it('should return a class instance', () => {
      const value = request.setResponseProcessed();
      expect(value instanceof PipelineRequest).toEqual(true);
    });
  });

  describe('setHandleErrors()', () => {
    it('should throw if input is a number', (done) => {
      try {
        request.setHandleErrors(123);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input is an array', (done) => {
      try {
        request.setHandleErrors(['some value']);
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input is an object', (done) => {
      try {
        request.setHandleErrors({ someKey: 'someValue' });
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should throw if input not one of the possible values', (done) => {
      try {
        request.setHandleErrors('SOME_WEIRD_THING');
        done('Did not throw');
      } catch (e) {
        done();
      }
    });

    it('should set to default if no parameter supplied', () => {
      request.setHandleErrors();
      expect(request.handleErrors).toEqual(DEFAULT_HANDLE_ERROR);
    });

    it('should set the new process', () => {
      request.setHandleErrors(errorHandleTypes.ERROR_HANDLE_SUPPRESS);
      expect(request.handleErrors).toEqual(errorHandleTypes.ERROR_HANDLE_SUPPRESS);
    });

    it('should return a class instance', () => {
      const value = request.setHandleErrors();
      expect(value instanceof PipelineRequest).toEqual(true);
    });
  });

  describe('setHandleErrors()', () => {
    it('should set a blacklist of error codes to be not handled', () => {
      const codes = ['ETEST1', 'ETEST2'];
      request.setErrorBlacklist(codes);
      expect(request.errorBlacklist).toEqual(codes);
    });
  });

  describe('deprecation', () => {
    it('setSuppressErrors', () => {
      request.setSuppressErrors(true);
      expect(request.handleErrors).toEqual(errorHandleTypes.ERROR_HANDLE_SUPPRESS);

      request.setSuppressErrors(false);
      expect(request.handleErrors).toEqual(DEFAULT_HANDLE_ERROR);
    });

    it('setHandledErrors', () => {
      const codes = ['ETEST'];
      request.setHandledErrors(codes);
      expect(request.errorBlacklist).toEqual(codes);
    });
  });
});
