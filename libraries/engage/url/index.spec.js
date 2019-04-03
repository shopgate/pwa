import * as url from '.';

describe('engage > url', () => {
  it('should have exports', () => {
    expect(typeof url).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(url).forEach((exportKey) => {
      expect(typeof url[exportKey] !== 'undefined').toBe(true);
    });
  });
});
