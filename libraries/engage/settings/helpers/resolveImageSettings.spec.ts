import { getThemeSettings } from '@shopgate/engage/core/config/getThemeSettings';
import type { ImageSettings } from '../types/appSettings';
import { DEFAULT_APP_SETTINGS } from '../reducers/appSettings';
import { DEFAULT_IMAGE_QUALITY } from '../constants/imageSettings';
import {
  resolveImageServiceSettings,
  resolveProductImageSettings,
} from './resolveImageSettings';

jest.mock('@shopgate/engage/core/config/getThemeSettings', () => ({
  getThemeSettings: jest.fn(),
}));

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: { warn: jest.fn() },
}));

const mockedGetThemeSettings = getThemeSettings as jest.Mock;

/**
 * The resolutions the legacy defaults shipped with. Everything derived at a 1:1 ratio has to
 * reproduce these exactly, otherwise the migration silently changed every image in the app.
 */
const LEGACY_RESOLUTIONS = {
  pdp: [{ width: 440, height: 440 }, { width: 1024, height: 1024 }],
  gallery: [{ width: 1024, height: 1024 }, { width: 2048, height: 2048 }],
  list: [{ width: 440, height: 440 }],
};

/**
 * Builds image settings on top of the built-in defaults.
 * @param overrides Partial settings to apply.
 * @returns The image settings.
 */
const buildImageSettings = (overrides: Partial<ImageSettings> = {}): ImageSettings => ({
  ...DEFAULT_APP_SETTINGS.images,
  ...overrides,
});

describe('settings / helpers / resolveImageSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetThemeSettings.mockReturnValue(undefined);
  });

  describe('resolveProductImageSettings', () => {
    describe('hydrated', () => {
      it('reproduces the legacy resolutions at the default 1:1 ratio', () => {
        const resolved = resolveProductImageSettings(true, buildImageSettings());

        expect(resolved.pdp.resolutions).toEqual(LEGACY_RESOLUTIONS.pdp);
        expect(resolved.gallery.resolutions).toEqual(LEGACY_RESOLUTIONS.gallery);
        expect(resolved.list.resolutions).toEqual(LEGACY_RESOLUTIONS.list);
      });

      it('returns the configured ratio as a tuple', () => {
        const resolved = resolveProductImageSettings(true, buildImageSettings());

        expect(resolved.pdp.ratio).toEqual([1, 1]);
      });

      it('fans a single global ratio out across every context', () => {
        const settings = buildImageSettings({
          product: { ...DEFAULT_APP_SETTINGS.images.product, ratio: { width: 4, height: 5 } },
        });

        const resolved = resolveProductImageSettings(true, settings);

        expect(resolved.list.resolutions).toEqual([{ width: 440, height: 550 }]);
        expect(resolved.pdp.resolutions).toEqual([
          { width: 440, height: 550 },
          { width: 1024, height: 1280 },
        ]);
        expect(resolved.gallery.resolutions).toEqual([
          { width: 1024, height: 1280 },
          { width: 2048, height: 2560 },
        ]);
        expect(resolved.pdp.ratio).toEqual([4, 5]);
      });

      it('lets a per context override win for that context only', () => {
        // No source writes these overrides yet - honoring them means per context ratios can later
        // be rolled out from the admin alone.
        const settings = buildImageSettings({
          product: {
            ...DEFAULT_APP_SETTINGS.images.product,
            ratio: { width: 4, height: 5 },
            list: { ratio: { width: 1, height: 1 } },
          },
        });

        const resolved = resolveProductImageSettings(true, settings);

        expect(resolved.list.resolutions).toEqual([{ width: 440, height: 440 }]);
        expect(resolved.list.ratio).toEqual([1, 1]);
        expect(resolved.pdp.ratio).toEqual([4, 5]);
        expect(resolved.gallery.ratio).toEqual([4, 5]);
      });

      it('rounds derived heights to whole pixels', () => {
        const settings = buildImageSettings({
          product: { ...DEFAULT_APP_SETTINGS.images.product, ratio: { width: 16, height: 9 } },
        });

        // 440 * 9 / 16 = 247.5
        expect(resolveProductImageSettings(true, settings).list.resolutions)
          .toEqual([{ width: 440, height: 248 }]);
      });

      it('ignores the legacy settings entirely', () => {
        mockedGetThemeSettings.mockReturnValue({ ListImage: [{ width: 1, height: 1 }] });

        expect(resolveProductImageSettings(true, buildImageSettings()).list.resolutions)
          .toEqual(LEGACY_RESOLUTIONS.list);
      });
    });

    describe('not hydrated', () => {
      it('passes the legacy resolutions through unchanged, with no ratio', () => {
        const legacyList = [{ width: 300, height: 400 }];
        mockedGetThemeSettings.mockReturnValue({ ListImage: legacyList });

        const resolved = resolveProductImageSettings(false, buildImageSettings());

        expect(resolved.list.resolutions).toBe(legacyList);
        expect(resolved.list.ratio).toBeNull();
      });

      it('ignores the configured ratio', () => {
        mockedGetThemeSettings.mockReturnValue({ ListImage: [{ width: 300, height: 400 }] });

        const settings = buildImageSettings({
          product: { ...DEFAULT_APP_SETTINGS.images.product, ratio: { width: 4, height: 5 } },
        });

        expect(resolveProductImageSettings(false, settings).list.resolutions)
          .toEqual([{ width: 300, height: 400 }]);
      });

      it.each([
        ['undefined', undefined],
        ['an empty object', {}],
        ['empty arrays', { HeroImage: [], GalleryImage: [], ListImage: [] }],
      ])('falls back to the legacy defaults when the theme config is %s', (_, themeSettings) => {
        mockedGetThemeSettings.mockReturnValue(themeSettings);

        const resolved = resolveProductImageSettings(false, buildImageSettings());

        expect(resolved.pdp.resolutions).toEqual(LEGACY_RESOLUTIONS.pdp);
        expect(resolved.gallery.resolutions).toEqual(LEGACY_RESOLUTIONS.gallery);
        expect(resolved.list.resolutions).toEqual(LEGACY_RESOLUTIONS.list);
      });
    });
  });

  describe('resolveImageServiceSettings', () => {
    it('reports the color and the transparency flag separately', () => {
      expect(resolveImageServiceSettings(true, buildImageSettings())).toMatchObject({
        fillColor: 'FFFFFF',
        fillTransparent: true,
      });
    });

    it('carries a disabled transparency flag through', () => {
      const settings = buildImageSettings({ fillTransparent: false });

      expect(resolveImageServiceSettings(true, settings)).toMatchObject({
        fillColor: 'FFFFFF',
        fillTransparent: false,
      });
    });

    it('splits the packed legacy value', () => {
      mockedGetThemeSettings.mockReturnValue({ fillColor: 'AAAAAA,0' });

      expect(resolveImageServiceSettings(false, buildImageSettings())).toMatchObject({
        fillColor: 'AAAAAA',
        fillTransparent: false,
      });
    });

    // The theme configuration already holds the format the image service expects.
    it('takes the legacy color as it is', () => {
      mockedGetThemeSettings.mockReturnValue({ fillColor: 'aaa,1' });

      expect(resolveImageServiceSettings(false, buildImageSettings()).fillColor).toBe('aaa');
    });

    it('defaults the legacy flag to enabled when the suffix is absent', () => {
      mockedGetThemeSettings.mockReturnValue({ fillColor: '000000' });

      expect(resolveImageServiceSettings(false, buildImageSettings())).toMatchObject({
        fillColor: '000000',
        fillTransparent: true,
      });
    });

    it('falls back to the default color when the legacy value is missing', () => {
      expect(resolveImageServiceSettings(false, buildImageSettings()).fillColor)
        .toBe('FFFFFF');
    });

    it('reports the configured quality', () => {
      const settings = buildImageSettings({ quality: 42 });

      expect(resolveImageServiceSettings(true, settings).quality).toBe(42);
    });

    // The unhydrated slice holds DEFAULT_IMAGE_QUALITY, which is derived from the legacy theme
    // config, so the quality needs no hydration branch of its own.
    it('reports the default quality before hydration', () => {
      expect(resolveImageServiceSettings(false, buildImageSettings()).quality)
        .toBe(DEFAULT_IMAGE_QUALITY);
    });
  });
});
