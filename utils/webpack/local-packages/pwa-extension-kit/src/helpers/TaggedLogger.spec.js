import TaggedLogger from './TaggedLogger';

const mockedLogMethod = jest.fn();

jest.mock('./_getConsole', () => () => ({
  log: (...args) => mockedLogMethod('log', ...args),
  warn: (...args) => mockedLogMethod('warn', ...args),
  error: (...args) => mockedLogMethod('error', ...args),
}));

describe('helpers/TaggedLogger', () => {
  const testTag = 'TEST_TAG';
  const expectedTagPrefix = '[TEST_TAG]';
  let instance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create object', () => {
    instance = new TaggedLogger(testTag);
    expect(typeof instance).toBe('object');
    expect(instance.tag).toBe(testTag);
  });

  const supportedMethods = ['log', 'warn', 'error'];

  supportedMethods.forEach((method) => {
    it(`should send tagged .${method} with message only`, () => {
      const text = `Log message only for ${method}`;
      instance[method](text);
      expect(mockedLogMethod).toHaveBeenCalledWith(method, `${expectedTagPrefix} ${text}`);
    });

    it(`should send tagged .${method} with arguments`, () => {
      const text = `Log message with arguments for ${method}`;
      instance[method](text, 1, 2);
      expect(mockedLogMethod).toHaveBeenCalledWith(method, `${expectedTagPrefix} ${text}`, 1, 2);
    });
  });
});
