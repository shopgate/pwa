import * as registration from '.';

describe('engage > registration', () => {
  it('should have exports', () => {
    expect(typeof registration).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(registration).forEach((exportKey) => {
      expect(typeof registration[exportKey] !== 'undefined').toBe(true);
    });
  });
});
