import * as menu from '.';

describe('engage > menu', () => {
  it('should have exports', () => {
    expect(typeof menu).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(menu).forEach((exportKey) => {
      expect(typeof menu[exportKey] !== 'undefined').toBe(true);
    });
  });
});
