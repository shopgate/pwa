import * as user from '.';

describe('engage > user', () => {
  it('should have exports', () => {
    expect(typeof user).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(user).forEach((exportKey) => {
      expect(typeof user[exportKey] !== 'undefined').toBe(true);
    });
  });
});
