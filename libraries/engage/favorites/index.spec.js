import * as favorites from '.';

describe('engage > favorites', () => {
  it('should have exports', () => {
    expect(typeof favorites).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(favorites).forEach((exportKey) => {
      expect(typeof favorites[exportKey] !== 'undefined').toBe(true);
    });
  });
});
