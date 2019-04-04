import * as scanner from '.';

describe('engage > scanner', () => {
  it('should have exports', () => {
    expect(typeof scanner).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(scanner).forEach((exportKey) => {
      expect(typeof scanner[exportKey] !== 'undefined').toBe(true);
    });
  });
});
