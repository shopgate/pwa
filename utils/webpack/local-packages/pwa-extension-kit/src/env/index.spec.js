import env, { helpers } from './index';

describe('env/helpers', () => {
  it('should export all functions as default', () => {
    expect(typeof env).toBe('object');
    expect(typeof env.helpers).toBe('object');
  });

  it('should export isIOSTheme as named export', () => {
    expect(typeof helpers).toBe('object');
    expect(typeof helpers.isIOSTheme).toBe('function');
  });
});
