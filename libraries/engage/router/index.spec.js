import * as router from '.';

describe('engage > router', () => {
  it('should have exports', () => {
    expect(typeof router).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(router).forEach((exportKey) => {
      expect(typeof router[exportKey] !== 'undefined').toBe(true);
    });
  });
});
