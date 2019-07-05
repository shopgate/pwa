import errorManager, { emitter } from './';
import { DEFAULT_CONTEXT, DEFAULT_SEVERITY } from '../../constants/ErrorManager';

describe('ErrorManager', () => {
  beforeEach(() => {
    errorManager.constructor();
  });

  it('should accept a valid error object', () => {
    const code = 'EUNKNOWN';
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    const response = errorManager.validate({
      code,
      message,
      source,
    });

    expect(response).toEqual(true);
  });

  it('should reject an error object with missing mandatory fields', () => {
    const response = errorManager.validate();

    expect(response).toEqual(false);
  });

  it('should reject an error object with fields that are not a string', () => {
    const code = 404;
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    const response = errorManager.validate({
      code,
      message,
      source,
    });

    expect(response).toEqual(false);
  });

  it('should return the null when no override message is found', () => {
    const code = 'EUNKNOWN';
    const context = 'shopgate.catalog.getUser';
    const source = 'pipeline';

    const errorMessage = errorManager.getMessage(
      code,
      context,
      source
    );

    expect(errorMessage).toBeNull();
  });

  it('should return the message', () => {
    const code = 'EUNKNOWN';
    const context = 'shopgate.catalog.getFoo';
    const message = 'Test Message';

    errorManager.setMessage({
      code,
      context,
      message,
    });

    const errorMessage = errorManager.getMessage(
      code,
      `${context}.v1`,
      'pipeline'
    );

    expect(errorMessage).toBe(message);
  });

  it('should add an override message', () => {
    const code = 'EUNKNOWN';
    const context = 'shopgate.catalog.getUser';
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    errorManager.setMessage({
      code,
      context,
      message,
      source,
    });

    expect(errorManager.messages[`${source}-${context}-${code}`]).toEqual(message);
  });

  it('should add an override message with no set context', () => {
    const code = 'EUNKNOWN';
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    errorManager.setMessage({
      code,
      message,
      source,
    });

    expect(errorManager.messages[`${source}-${DEFAULT_CONTEXT}-${code}`]).toEqual(message);
  });

  it('should ignore setting a message with missing error object', () => {
    const code = 'EUNKNOWN';
    const source = 'pipeline';

    errorManager.setMessage();

    expect(errorManager.messages[`${source}-${DEFAULT_CONTEXT}-${code}`]).toBeUndefined();
  });

  it('should ignore setting a message with missing mandatory fields', () => {
    const code = 'EUNKNOWN';
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    errorManager.setMessage({
      message,
      source,
    });

    expect(errorManager.messages[`${source}-${DEFAULT_CONTEXT}-${code}`]).toBeUndefined();
  });

  it('should ignore setting a message with invalid input', () => {
    const code = 404;
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    errorManager.setMessage({
      code,
      message,
      source,
    });

    expect(errorManager.messages[`${source}-${DEFAULT_CONTEXT}-${code}`]).toBeUndefined();
  });

  it('should not queue a missing error', () => {
    const code = 'EUNKNOWN';
    const source = 'pipeline';

    errorManager.queue();

    expect(errorManager.messages[`${source}-${DEFAULT_CONTEXT}-${code}`]).toBeUndefined();
  });

  it('should not queue an invalid error', () => {
    const code = 404;
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    errorManager.queue({
      code,
      message,
      source,
    });

    expect(errorManager.errorQueue.has(`${source}-${DEFAULT_CONTEXT}-${code}`)).toEqual(false);
  });

  it('should queue errors only once', () => {
    const code = 'EUNKNOWN';
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    const callback = jest.fn();
    emitter.addListener('pipeline', callback);

    errorManager.queue({
      code,
      message,
      source,
    });

    errorManager.queue({
      code,
      message,
      source,
    });

    expect(errorManager.errorQueue.has(`${source}-${DEFAULT_CONTEXT}-${code}`)).toEqual(true);
    expect(errorManager.errorQueue.size).toEqual(1);
  });

  it('should not dispatch when there are no errors', async () => {
    const callback = jest.fn();
    emitter.addListener('pipeline', callback);

    const dispatch = errorManager.dispatch();

    expect(dispatch).toEqual(false);
  });

  it('should dispatch the errors through events', async () => {
    const code = 'EUNKNOWN';
    const message = 'Something went horribly wrong!';
    const source = 'pipeline';

    const callback = jest.fn();
    const callback2 = jest.fn();
    emitter.addListener('pipeline', callback);
    emitter.addListener('pipeline', callback2);

    await errorManager.queue({
      code,
      message,
      source,
    });

    await errorManager.queue({
      code: 'EUNKNOWN2',
      message,
      source,
    });

    expect(errorManager.errorQueue.size).toEqual(2);
    errorManager.dispatch();

    expect(callback).toBeCalled();
    expect(callback2).toBeCalled();
    expect(errorManager.errorQueue.size).toEqual(0);
  });

  it('should set a queue entry with meta data', () => {
    const code = 'EUNKNOWN';
    const replacementMessage = 'Replacement Message';
    const message = 'Original Message';
    const source = 'pipeline';

    // Setup a replacement message for the error code.
    errorManager.setMessage({
      code,
      source,
      message: replacementMessage,
    });

    const callback = jest.fn();
    emitter.addListener('pipeline', callback);

    errorManager.queue({
      message,
      code,
      source,
    });

    errorManager.dispatch();
    expect(callback).toBeCalledWith({
      id: `${source}-${DEFAULT_CONTEXT}-${code}`,
      context: DEFAULT_CONTEXT,
      message: replacementMessage,
      code,
      source,
      meta: {
        message,
      },
      severity: DEFAULT_SEVERITY,
    });
  });
});
