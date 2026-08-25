import { type MediaMarginSettings } from '@shopgate/engage/settings/types/appSettings';
import { getAppliedMediaMargins, resolveWidgetLayout } from './helpers';

jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  componentsConfig: {
    portals: {},
    widgets: {},
    widgetsV2: {
      '@shopgate/widgets/imageWidget': {
        path: '@shopgate/engage/page/widgets/Image',
        config: {
          layout: { applyMediaMargins: true },
        },
      },
      '@shopgate/widgets/headlineWidget': {
        path: '@shopgate/engage/page/widgets/Headline',
        config: {
          layout: {
            applyMediaMargins: {
              top: true,
              bottom: true,
            },
          },
        },
      },
      '@shopgate/widgets/richTextWidget': {
        path: '@shopgate/engage/page/widgets/RichText',
      },
    },
  },
}));

const ALL_SIDES = {
  top: true,
  bottom: true,
  left: true,
  right: true,
};

const VERTICAL_ONLY = {
  top: true,
  bottom: true,
};

const SETTINGS: MediaMarginSettings = {
  top: 16,
  bottom: 16,
  left: 8,
  right: 8,
};

const NO_LAYOUT = {
  marginTop: null,
  marginBottom: null,
  marginLeft: null,
  marginRight: null,
};

describe('page / components / Widgets / helpers', () => {
  describe('getAppliedMediaMargins', () => {
    it('expands a blanket declaration to all sides', () => {
      expect(getAppliedMediaMargins('@shopgate/widgets/imageWidget')).toEqual(ALL_SIDES);
    });

    it('passes a per side declaration through', () => {
      expect(getAppliedMediaMargins('@shopgate/widgets/headlineWidget')).toEqual(VERTICAL_ONLY);
    });

    it('returns no sides for a widget without a declaration', () => {
      expect(getAppliedMediaMargins('@shopgate/widgets/richTextWidget')).toEqual({});
    });

    it('returns no sides for an unknown widget', () => {
      expect(getAppliedMediaMargins('@vendor/widgets/unknown')).toEqual({});
    });
  });

  describe('resolveWidgetLayout', () => {
    it('applies the margins to the sides a widget asked for', () => {
      expect(resolveWidgetLayout(NO_LAYOUT, ALL_SIDES, SETTINGS)).toEqual({
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 8,
        marginRight: 8,
      });
    });

    it('leaves out the sides a widget did not ask for', () => {
      const layout = resolveWidgetLayout(NO_LAYOUT, VERTICAL_ONLY, SETTINGS);

      expect(layout).toEqual({
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 0,
      });
    });

    it('resolves to zero when a widget asked for nothing', () => {
      expect(resolveWidgetLayout(NO_LAYOUT, {}, SETTINGS)).toEqual({
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      });
    });

    it('lets the configuration of the widget win over the default', () => {
      const layout = resolveWidgetLayout({
        ...NO_LAYOUT,
        marginTop: 24,
      }, ALL_SIDES, SETTINGS);

      expect(layout.marginTop).toBe(24);
      expect(layout.marginBottom).toBe(16);
    });

    it('lets a configured zero win over the default', () => {
      const layout = resolveWidgetLayout({
        ...NO_LAYOUT,
        marginTop: 0,
      }, ALL_SIDES, SETTINGS);

      expect(layout.marginTop).toBe(0);
    });

    it('applies the configuration of a widget that asked for nothing', () => {
      const layout = resolveWidgetLayout({
        ...NO_LAYOUT,
        marginLeft: 12,
      }, {}, SETTINGS);

      expect(layout).toEqual({
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 12,
        marginRight: 0,
      });
    });

    it('resolves to zero without a layout and without settings', () => {
      expect(resolveWidgetLayout(undefined, ALL_SIDES, undefined as unknown as MediaMarginSettings))
        .toEqual({
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
        });
    });
  });
});
