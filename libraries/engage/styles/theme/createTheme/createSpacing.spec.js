import createSpacing from './createSpacing';

let consoleSpy;

describe('theme => createSpacing', () => {
  beforeAll(() => {
    // Deactivate the console for the next tests to avoid logs within the test report.
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  afterEach(() => {
    consoleSpy.mockReset();
  });

  it('should work as expected', () => {
    const spacing = createSpacing();
    expect(spacing(1)).toEqual(8);
  });

  it('should support multiple arguments', () => {
    const spacing = createSpacing();
    expect(spacing(1, 2)).toEqual('8px 16px');
  });

  it('should support string arguments', () => {
    const spacing = createSpacing();
    expect(spacing(1, 'auto')).toEqual('8px auto');
  });

  it('should tog an error for too many arguments', () => {
    const spacing = createSpacing();
    expect(spacing(1, 2, 'auto', 4, 5)).toEqual('8px 16px auto 32px');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
