import * as engage from '.';

describe('engage', () => {
  it('should have exports', () => {
    expect(typeof engage).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(engage).forEach((exportKey) => {
      expect(typeof engage[exportKey] !== 'undefined').toBe(true);
    });
  });
});
