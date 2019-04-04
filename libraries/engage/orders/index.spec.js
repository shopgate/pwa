import * as orders from '.';

describe('engage > orders', () => {
  it('should have exports', () => {
    expect(typeof orders).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(orders).forEach((exportKey) => {
      expect(typeof orders[exportKey] !== 'undefined').toBe(true);
    });
  });
});
