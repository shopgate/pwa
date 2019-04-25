import * as market from '.';

describe('engage > market', () => {
  it('should have exports', () => {
    expect(typeof market).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(market).forEach((exportKey) => {
      expect(typeof market[exportKey] !== 'undefined').toBe(true);
    });
  });
});
