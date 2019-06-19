import * as a11y from '.';

describe('engage > a11y', () => {
  it('should have exports', () => {
    expect(typeof a11y).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(a11y).forEach((exportKey) => {
      expect(typeof a11y[exportKey] !== 'undefined').toBe(true);
    });
  });
});
