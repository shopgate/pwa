import * as category from '.';

describe('engage > category', () => {
  it('should have exports', () => {
    expect(typeof category).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(category).forEach((exportKey) => {
      expect(typeof category[exportKey] !== 'undefined').toBe(true);
    });
  });
});
