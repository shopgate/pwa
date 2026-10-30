import { getActionIcon } from './icons';

jest.mock('@shopgate/engage/icons/helpers/themeIcons', () => ({
  ...jest.requireActual('@shopgate/engage/icons/helpers/themeIcons'),
  getLegacyThemeIcons: () => ({
    custom: '<path d="custom"/>',
    empty: '',
  }),
}));

describe('getActionIcon', () => {
  it('renders the icons by their names, the same component every time', () => {
    const icon = getActionIcon('magnifier');

    expect(icon).toEqual(expect.any(Function));
    expect(getActionIcon('magnifier')).toBe(icon);
  });

  it('maps the header icon names that differ from the icon names', () => {
    expect(getActionIcon('store')).toBe(getActionIcon('locator'));
    expect(getActionIcon('pin')).toBe(getActionIcon('location'));
  });

  it('renders other icons of the shop theme config', () => {
    expect(getActionIcon('custom')).toEqual(expect.any(Function));
  });

  it.each(['', 'unknown', 'empty', 'constructor', 'toString', '__proto__'])('has no icon for %j', (name) => {
    expect(getActionIcon(name)).toBeNull();
  });
});
