import ScanProcessingError from './ScanProcessingError';

describe('ScanProcessingError', () => {
  it('should create the error as expected everything is set properly', () => {
    const message = 'Message';
    const title = 'Title';
    const error = new ScanProcessingError(message, title);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.title).toBe(title);
  });

  it('should create the error as expected when just a message is set', () => {
    const message = 'Message';
    const error = new ScanProcessingError(message);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.title).toBe(null);
  });
});
