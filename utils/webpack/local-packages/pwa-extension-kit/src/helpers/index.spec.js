import helpers, { TaggedLogger } from './index';

describe('/helpers', () => {
  it('should export all functions as default', () => {
    expect(typeof helpers).toBe('object');
    expect(typeof helpers.TaggedLogger).toBe('function');
  });

  it('should export as named export', () => {
    expect(typeof TaggedLogger).toBe('function');
  });
});
