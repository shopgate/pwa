import * as product from '.';

describe('engage > product', () => {
  it('should have exports', () => {
    expect(typeof product).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(product).forEach((exportKey) => {
      expect(typeof product[exportKey] !== 'undefined').toBe(true);
    });
  });
});
