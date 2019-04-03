import * as store from '.';

describe('engage > store', () => {
  it('should have exports', () => {
    expect(typeof store).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(store).forEach((exportKey) => {
      expect(typeof store[exportKey] !== 'undefined').toBe(true);
    });
  });
});
