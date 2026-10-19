import { MagnifierIcon, LocatorIcon } from '@shopgate/engage/components';
import { getActionIcon } from './icons';

jest.mock('@shopgate/engage', () => ({
  themeConfig: {
    icons: {
      custom: '<path d="custom"/>',
      empty: '',
    },
  },
}));
jest.mock('@shopgate/engage/components', () => {
  const icons = {};
  return new Proxy(icons, {
    get: (target, name) => {
      if (!icons[name]) {
        icons[name] = Object.assign(() => null, { displayName: name });
      }
      return icons[name];
    },
  });
});

describe('getActionIcon', () => {
  it('uses the icon components of the library', () => {
    expect(getActionIcon('magnifier')).toBe(MagnifierIcon);
    expect(getActionIcon('store')).toBe(LocatorIcon);
  });

  it('renders other icons of the shop theme config, the same component every time', () => {
    const icon = getActionIcon('custom');

    expect(icon).toEqual(expect.any(Function));
    expect(getActionIcon('custom')).toBe(icon);
  });

  it.each(['', 'unknown', 'empty', 'constructor', 'toString', '__proto__'])('has no icon for %j', (name) => {
    expect(getActionIcon(name)).toBeNull();
  });
});
