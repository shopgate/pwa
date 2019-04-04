import * as search from '.';

describe('engage > search', () => {
  it('should have exports', () => {
    expect(typeof search).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(search).forEach((exportKey) => {
      expect(typeof search[exportKey] !== 'undefined').toBe(true);
    });
  });
});
