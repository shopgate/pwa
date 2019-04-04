import * as cart from '.';

describe('engage > cart', () => {
  it('should have exports', () => {
    expect(typeof cart).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(cart).forEach((exportKey) => {
      expect(typeof cart[exportKey] !== 'undefined').toBe(true);
    });
  });
});
