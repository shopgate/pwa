import * as core from '.';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('engage > core', () => {
  it('should have exports', () => {
    expect(typeof core).toEqual('object');
  });

  it('should not do undefined exports', () => {
    Object.keys(core).forEach((exportKey) => {
      expect(typeof core[exportKey] !== 'undefined').toBe(true);
    });
  });
});
