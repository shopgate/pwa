import { setIconOverrides } from '@shopgate/engage/icons/helpers/overrides';
import { getActionIcon, NoIcon, resolveActionIcon } from './actionIcons';

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

  it('uses the icon names as they are', () => {
    expect(getActionIcon('store')).not.toBe(getActionIcon('locator'));
  });

  it('renders other icons of the shop theme config', () => {
    expect(getActionIcon('custom')).toEqual(expect.any(Function));
  });

  it('has no icon once the custom icon it used is removed', () => {
    setIconOverrides({ 'custom/abc': { svg: '<svg/>' } });

    expect(getActionIcon('custom/abc')).toEqual(expect.any(Function));

    setIconOverrides(null);

    expect(getActionIcon('custom/abc')).toBeNull();
  });

  it.each(['', 'unknown', 'pin', 'empty', 'constructor', 'toString', '__proto__'])('has no icon for %j', (name) => {
    expect(getActionIcon(name)).toBeNull();
  });
});

describe('resolveActionIcon', () => {
  it('uses the first name that has an icon', () => {
    expect(resolveActionIcon('custom', 'magnifier')).toBe(getActionIcon('custom'));
  });

  it('skips names without an icon', () => {
    expect(resolveActionIcon('unknown', '', undefined, 'empty', 'magnifier', 'custom'))
      .toBe(getActionIcon('magnifier'));
  });

  it.each([
    [[]],
    [['unknown', '', undefined, 'empty']],
  ])('uses NoIcon when no name of %j has an icon', (names) => {
    expect(resolveActionIcon(...names)).toBe(NoIcon);
  });

  it('renders nothing for NoIcon', () => {
    expect(NoIcon()).toBeNull();
  });
});
