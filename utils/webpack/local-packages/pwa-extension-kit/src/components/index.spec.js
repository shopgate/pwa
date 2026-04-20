import components, { ProductCharacteristics } from './index';
describe('components', () => {
  it('should export all functions as default', () => {
    expect(typeof components).toBe('object');
    expect(typeof components.ProductCharacteristics).toBe('function');
  });

  it('should export as named export', () => {
    expect(typeof ProductCharacteristics).toBe('function');
  });
});
