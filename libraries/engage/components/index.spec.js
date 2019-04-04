import * as components from '.';

describe('engage > components', () => {
  it('should have exports', () => {
    expect(typeof components).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(components).forEach((exportKey) => {
      expect(typeof components[exportKey] !== 'undefined').toBe(true);
    });
  });
});
