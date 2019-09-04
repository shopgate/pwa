import Request from '../Request';
import RequestManager from '.';
import {
  PROCESS_ANY,
  PROCESS_LAST_REQUEST,
  PROCESS_FIRST_RESPONSE,
  PROCESS_SEQUENTIALLY,
  PROCESS_ORDERED_REQUEST,
  PROPAGATE_REJECT,
  PROPAGATE_SINGLE,
} from '../../constants/RequestManagerModes';

/* eslint-disable require-jsdoc, no-unused-vars, class-methods-use-this */
class SuccessfulRequest extends Request {
  constructor(manager, payload = 42, timeout = 1000) {
    super(manager);
    this.createSerial('foo');
    this.payload = payload;
    this.timeout = timeout;
  }

  onDispatch(resolve, reject) {
    setTimeout(() => {
      this.manager.handleResponse(this, resolve, this.payload);
    }, this.timeout);
  }
}

class FailingRequest extends Request {
  constructor(manager) {
    super(manager);
    this.createSerial('foo');
  }

  onDispatch(resolve, reject) {
    this.manager.handleError(this, reject);
  }
}

class NeverResolvingRequest extends Request {
  constructor(manager) {
    super(manager);
    this.createSerial('foo');
  }

  onDispatch(resolve, reject) {}

  onTimeout(resolve, reject) {
    this.manager.handleError(this, reject);
  }
}
/* eslint-enable require-jsdoc, no-unused-vars, class-methods-use-this */

describe.skip('RequestManager', () => {
  jest.useFakeTimers();

  let timestamp = 0;
  RequestManager.currentTime = () => {
    timestamp += 1;
    return timestamp;
  };

  it('should default to PROCESS_ANY and PROPAGATE_SINGLE', async () => {
    const manager = new RequestManager();
    expect(manager.processingMode).toEqual(PROCESS_ANY);
    expect(manager.propagationMode).toEqual(PROPAGATE_SINGLE);
  });

  it('should succeed', async () => {
    const succeeded = jest.fn();
    const failed = jest.fn();

    const manager = new RequestManager();
    const request = new SuccessfulRequest(manager);

    const req = request.dispatch().then(succeeded).catch(failed);
    jest.runAllTimers();
    await req;

    expect(succeeded).toHaveBeenCalled();
    expect(failed).not.toHaveBeenCalled();
  });

  it('should fail', async () => {
    const succeeded = jest.fn();
    const failed = jest.fn();

    const manager = new RequestManager();
    const request = new FailingRequest(manager);

    const req = request.dispatch().then(succeeded).catch(failed);
    jest.runAllTimers();
    await req;

    expect(succeeded).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalled();
  });

  it('should only resolve the last request ', async () => {
    const succeeded = jest.fn();
    const failed = jest.fn();

    const manager = new RequestManager({
      processingMode: PROCESS_LAST_REQUEST,
      propagationMode: PROPAGATE_REJECT,
    });
    const request1 = new SuccessfulRequest(manager, 1);
    const request2 = new SuccessfulRequest(manager, 2);

    const req1 = request1.dispatch().then(resp => succeeded(resp)).catch(() => failed(1));
    const req2 = request2.dispatch().then(resp => succeeded(resp)).catch(() => failed(2));
    jest.runAllTimers();
    await req1;
    await req2;

    expect(succeeded).toHaveBeenCalledTimes(1);
    expect(succeeded).toHaveBeenCalledWith(2);
    expect(failed).toHaveBeenCalledTimes(1);
    expect(failed).toHaveBeenCalledWith(1);
  });

  it('should resolve both request with first request´s response (1/2)', async () => {
    const succeeded = jest.fn();
    const failed = jest.fn();

    const manager = new RequestManager({
      processingMode: PROCESS_FIRST_RESPONSE,
    });
    const request1 = new SuccessfulRequest(manager, 1, 500);
    const request2 = new SuccessfulRequest(manager, 2, 1000);

    const req1 = request1.dispatch().then(resp => succeeded(resp)).catch(() => failed(1));
    const req2 = request2.dispatch().then(resp => succeeded(resp)).catch(() => failed(2));
    jest.runAllTimers();
    await req1;
    await req2;

    expect(succeeded).toHaveBeenCalledTimes(2);
    expect(succeeded).toHaveBeenCalledWith(1);
    expect(failed).not.toHaveBeenCalled();
  });

  it('should resolve both request with first request´s response (2/2)', async () => {
    const succeeded = jest.fn();
    const failed = jest.fn();

    const manager = new RequestManager({
      processingMode: PROCESS_FIRST_RESPONSE,
    });
    const request1 = new SuccessfulRequest(manager, 1, 1000);
    const request2 = new SuccessfulRequest(manager, 2, 500);

    const req1 = request1.dispatch().then(resp => succeeded(resp)).catch(() => failed(1));
    const req2 = request2.dispatch().then(resp => succeeded(resp)).catch(() => failed(2));
    jest.runAllTimers();
    await req1;
    await req2;

    expect(succeeded).toHaveBeenCalledTimes(2);
    expect(succeeded.mock.calls).toEqual([[2], [2]]);
    expect(failed).not.toHaveBeenCalled();
  });

  it.skip('should reject first request', async () => {
    const succeeded = jest.fn();
    const failed = jest.fn();

    const manager = new RequestManager({
      processingMode: PROCESS_FIRST_RESPONSE,
      propagationMode: PROPAGATE_REJECT,
    });
    const request1 = new SuccessfulRequest(manager, 1, 1000);
    const request2 = new SuccessfulRequest(manager, 2, 500);

    const req1 = request1.dispatch().then(resp => succeeded(resp)).catch(() => failed(1));
    const req2 = request2.dispatch().then(resp => succeeded(resp)).catch(() => failed(2));
    jest.runAllTimers();
    await req1;
    await req2;

    expect(succeeded).toHaveBeenCalledTimes(1);
    expect(succeeded).toHaveBeenCalledWith(2);
    expect(failed).toHaveBeenCalledTimes(1);
    expect(failed).toHaveBeenCalledWith(1);
  });

  it('should request the second one after the first one resolved', () => {
    const manager = new RequestManager({
      processingMode: PROCESS_SEQUENTIALLY,
    });

    const request1 = new SuccessfulRequest(manager);
    const request2 = new SuccessfulRequest(manager);

    request1.dispatch();
    request2.dispatch();

    expect(manager.requestQueue.length).toBe(2);

    jest.runOnlyPendingTimers();
    expect(manager.requestQueue.length).toBe(1);

    jest.runOnlyPendingTimers();
    expect(manager.requestQueue.length).toBe(0);
  });

  it('should resolve in order of request calling', async () => {
    const succeeded = jest.fn();

    const manager = new RequestManager({
      processingMode: PROCESS_ORDERED_REQUEST,
    });

    const request1 = new SuccessfulRequest(manager, 1, 1000);
    const request2 = new SuccessfulRequest(manager, 2, 500);

    const req1 = request1.dispatch().then(resp => succeeded(resp));
    const req2 = request2.dispatch().then(resp => succeeded(resp));
    jest.runOnlyPendingTimers();
    expect(manager.requestQueue.length).toBe(0);
    await req1;
    await req2;

    expect(succeeded.mock.calls).toEqual([[1], [2]]);
  });

  it('should time out', async () => {
    const succeeded = jest.fn();
    const failed = jest.fn();

    const manager = new RequestManager({ timeout: 1000 });
    const request = new NeverResolvingRequest(manager);

    const req = request.dispatch().then(succeeded).catch(failed);
    jest.runAllTimers();
    await req;

    expect(succeeded).not.toHaveBeenCalled();
    expect(failed).toHaveBeenCalled();
  });
});
