import * as navigation from '.';

describe('engage > navigation', () => {
  it('should have exports', () => {
    expect(typeof navigation).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(navigation).forEach((exportKey) => {
      expect(typeof navigation[exportKey] !== 'undefined').toBe(true);
    });
  });
});
