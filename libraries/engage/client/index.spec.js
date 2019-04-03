import * as client from '.';

describe('engage > client', () => {
  it('should have exports', () => {
    expect(typeof client).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(client).forEach((exportKey) => {
      expect(typeof client[exportKey] !== 'undefined').toBe(true);
    });
  });
});
