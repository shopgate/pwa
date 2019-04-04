import * as checkout from '.';

describe('engage > checkout', () => {
  it('should have exports', () => {
    expect(typeof checkout).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(checkout).forEach((exportKey) => {
      expect(typeof checkout[exportKey] !== 'undefined').toBe(true);
    });
  });
});
