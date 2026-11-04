import { logger } from '@shopgate/engage/core/helpers';
import { coreIcons } from '../defaults/coreIcons';
import { getIconCatalog } from './catalog';
import { registerIcons } from './registry';
import { resolveIcon } from './resolveIcon';

const mockLegacyIcons: Record<string, string | null> = {};

jest.mock('./themeIcons', () => ({
  ...jest.requireActual('./themeIcons'),
  getLegacyThemeIcons: () => mockLegacyIcons,
}));

jest.mock('@shopgate/engage/core/helpers', () => ({
  logger: { warn: jest.fn() },
}));

const BURGER_DEFAULT = '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>';

describe('engage > icons > helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(mockLegacyIcons).forEach((name) => {
      delete mockLegacyIcons[name];
    });
  });

  describe('resolveIcon', () => {
    it('prefers an override of the app settings', () => {
      mockLegacyIcons.cart = '<path d="legacy"/>';

      const overrides = {
        cart: {
          svg: '<svg/>',
          keepColors: true,
        },
      };

      expect(resolveIcon('cart', overrides)).toEqual({
        svg: '<svg/>',
        keepColors: true,
        source: 'override',
        normalize: true,
      });
    });

    it('passes the scale of an override on', () => {
      const overrides = {
        cart: {
          svg: '<svg/>',
          scale: 1.1,
        },
      };

      expect(resolveIcon('cart', overrides)).toEqual({
        svg: '<svg/>',
        keepColors: false,
        scale: 1.1,
        source: 'override',
        normalize: true,
      });
    });

    it('passes the line width of an override on', () => {
      const overrides = {
        cart: {
          svg: '<svg/>',
          strokeWidth: 1.5,
        },
      };

      expect(resolveIcon('cart', overrides)).toEqual({
        svg: '<svg/>',
        keepColors: false,
        strokeWidth: 1.5,
        source: 'override',
        normalize: true,
      });
    });

    it('uses an icon customized in the theme extension config', () => {
      mockLegacyIcons.cart = '<path d="legacy"/>';

      expect(resolveIcon('cart', {})).toEqual({
        svg: '<path d="legacy"/>',
        keepColors: false,
        source: 'legacy',
        normalize: true,
      });
    });

    it('ignores defaults the theme extension config shipped, whatever their formatting', () => {
      mockLegacyIcons.burger = `\n  ${BURGER_DEFAULT}\n`;

      expect(resolveIcon('burger', {})?.source).toBe('default');
    });

    it('falls back to the stored normalized core icon', () => {
      expect(resolveIcon('burger', {})).toEqual({
        svg: coreIcons.burger.svg,
        keepColors: false,
        source: 'default',
        normalize: false,
      });
    });

    it('resolves icons of the theme extension config without default', () => {
      mockLegacyIcons.custom = '<path d="custom"/>';

      expect(resolveIcon('custom', {})?.source).toBe('legacy');
    });

    it.each(['unknown', 'constructor', 'toString', '__proto__'])('has no icon for %j', (name) => {
      expect(resolveIcon(name, {})).toBeNull();
    });

    it('ignores overrides without markup', () => {
      expect(resolveIcon('cart', { cart: { svg: ' ' } })?.source).toBe('default');
    });
  });

  describe('registerIcons', () => {
    it('registers namespaced extension icons that get normalized', () => {
      registerIcons({
        '@shopgate/ext-foo/truck': '<svg viewBox="0 0 32 32"/>',
        '@shopgate/ext-foo/box': {
          svg: '<svg/>',
          keepColors: true,
        },
      });

      expect(resolveIcon('@shopgate/ext-foo/truck', {})).toEqual({
        svg: '<svg viewBox="0 0 32 32"/>',
        keepColors: false,
        source: 'default',
        normalize: true,
      });
      expect(resolveIcon('@shopgate/ext-foo/box', {})?.keepColors).toBe(true);
    });

    it('keeps the scale and line width of registered icons', () => {
      registerIcons({
        '@shopgate/ext-foo/sized': {
          svg: '<svg/>',
          scale: 0.9,
          strokeWidth: 1.5,
        },
        '@shopgate/ext-foo/flat': {
          svg: '<svg/>',
          strokeWidth: 0,
        },
      });

      expect(resolveIcon('@shopgate/ext-foo/sized', {})).toMatchObject({
        scale: 0.9,
        strokeWidth: 1.5,
      });
      expect(resolveIcon('@shopgate/ext-foo/flat', {})).not.toHaveProperty('strokeWidth');
    });

    it.each([
      ['a core icon name', { cart: '<svg/>' }],
      ['a name without namespace', { truck: '<svg/>' }],
      ['an icon without markup', { '@shopgate/ext-foo/empty': '' }],
    ])('skips %s', (_, icons) => {
      registerIcons(icons);

      expect(logger.warn).toHaveBeenCalled();
      expect(resolveIcon(Object.keys(icons)[0], {})?.svg).not.toBe('<svg/>');
    });
  });

  describe('getIconCatalog', () => {
    it('lists the core and the registered icons with their defaults', () => {
      registerIcons({ '@shopgate/ext-foo/truck': '<svg viewBox="0 0 32 32"/>' });
      mockLegacyIcons.cart = '<path d="legacy"/>';
      mockLegacyIcons.burger = BURGER_DEFAULT;

      const { version, icons } = getIconCatalog();

      expect(version).toBe(1);
      expect(icons).toContainEqual({
        name: 'cart',
        source: 'core',
        default: coreIcons.cart.svg,
        legacyOverride: '<path d="legacy"/>',
      });
      expect(icons).toContainEqual({
        name: 'burger',
        source: 'core',
        default: coreIcons.burger.svg,
      });
      expect(icons).toContainEqual({
        name: '@shopgate/ext-foo/truck',
        source: '@shopgate/ext-foo',
        default: '<svg viewBox="0 0 32 32"/>',
      });
    });
  });
});
