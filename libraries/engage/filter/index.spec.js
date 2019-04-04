import * as filter from '.';

describe('engage > filter', () => {
  it('should have exports', () => {
    expect(typeof filter).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(filter).forEach((exportKey) => {
      expect(typeof filter[exportKey] !== 'undefined').toBe(true);
    });
  });
});
