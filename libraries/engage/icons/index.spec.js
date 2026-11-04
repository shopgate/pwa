import * as icons from '.';

describe('engage > icons', () => {
  it('should have exports', () => {
    expect(typeof icons).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(icons).forEach((exportKey) => {
      expect(typeof icons[exportKey] !== 'undefined').toBe(true);
    });
  });
});
