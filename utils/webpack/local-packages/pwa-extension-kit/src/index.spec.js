import kit, { env, connectors, helpers } from './index';

describe('index', () => {
  it('should export all functions as default', () => {
   expect(typeof kit).toBe('object');
   expect(typeof kit.env).toBe('object');
   expect(typeof kit.connectors).toBe('object');
   expect(typeof kit.helpers).toBe('object');
  });

  it('should export as named export', () => {
    expect(typeof env).toBe('object');
    expect(typeof connectors).toBe('object');
    expect(typeof helpers).toBe('object');
  });
});
