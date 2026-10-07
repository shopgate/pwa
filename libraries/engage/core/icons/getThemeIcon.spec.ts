import { getThemeIcon } from './getThemeIcon';
import { CORE_ICONS } from './coreIcons';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  themeConfig: {
    icons: {
      cart: '<path d="shop-cart"/>',
      person: '',
    },
  },
}));

describe('getThemeIcon', () => {
  it('prefers the icon of the shop', () => {
    expect(getThemeIcon('cart')).toBe('<path d="shop-cart"/>');
  });

  it('falls back to the core icon when the shop has none or an empty one', () => {
    expect(getThemeIcon('pin')).toBe(CORE_ICONS.pin);
    expect(getThemeIcon('person')).toBe(CORE_ICONS.person);
  });

  it('returns null for unknown icons', () => {
    expect(getThemeIcon('nothing')).toBeNull();
  });

  it.each(['constructor', 'toString', '__proto__'])('ignores the object member %s', (name) => {
    expect(getThemeIcon(name)).toBeNull();
  });
});
