import * as app from '.';

describe('engage > app', () => {
  it('should have exports', () => {
    expect(typeof app).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(app).forEach((exportKey) => {
      expect(typeof app[exportKey] !== 'undefined').toBe(true);
    });
  });
});
