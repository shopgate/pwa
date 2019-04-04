import * as reviews from '.';

describe('engage > reviews', () => {
  it('should have exports', () => {
    expect(typeof reviews).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(reviews).forEach((exportKey) => {
      expect(typeof reviews[exportKey] !== 'undefined').toBe(true);
    });
  });
});
