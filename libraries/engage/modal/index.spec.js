import * as modal from '.';

describe('engage > modal', () => {
  it('should have exports', () => {
    expect(typeof modal).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(modal).forEach((exportKey) => {
      expect(typeof modal[exportKey] !== 'undefined').toBe(true);
    });
  });
});
