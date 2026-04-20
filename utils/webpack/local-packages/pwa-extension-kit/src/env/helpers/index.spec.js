import helpers, { isIOSTheme } from './index';

describe('env/helpers', () => {
  it('should export all functions as default', () => {
    expect(typeof helpers).toBe('object');
    expect(typeof helpers.isIOSTheme).toBe('function');
  });

  it('should export isIOSTheme as named export', () => {
    expect(typeof isIOSTheme).toBe('function');
  });
});
