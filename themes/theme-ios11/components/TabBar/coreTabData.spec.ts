import { CORE_TAB_TYPES, getCoreTabType, isCoreTabType } from './coreTabData';

describe('coreTabData', () => {
  it('lists the core tab types in the order of the legacy tab bar', () => {
    expect(CORE_TAB_TYPES).toEqual(['home', 'browse', 'cart', 'favorites', 'more']);
  });

  describe('isCoreTabType()', () => {
    it.each(CORE_TAB_TYPES)('recognizes %s as a core tab type', (type) => {
      expect(isCoreTabType(type)).toBe(true);
    });

    it.each(['categoryDrawer', 'none', '@shopgate/test/card', 'constructor', '__proto__'])('does not recognize %j as a core tab type', (name) => {
      expect(isCoreTabType(name)).toBe(false);
    });
  });

  describe('getCoreTabType()', () => {
    it.each([
      ['home', 'home'],
      ['browse', 'browse'],
      ['categoryDrawer', 'browse'],
      ['cart', 'cart'],
      ['favorites', 'favorites'],
      ['more', 'more'],
    ])('maps %s to the %s tab', (action, type) => {
      expect(getCoreTabType(action)).toBe(type);
    });

    it.each(['none', 'openSearch', '@shopgate/test/card', 'constructor', '__proto__'])('has no tab for %j', (action) => {
      expect(getCoreTabType(action)).toBeUndefined();
    });
  });
});
