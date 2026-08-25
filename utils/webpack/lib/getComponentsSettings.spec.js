const path = require('path');
const getComponentsSettings = require('./getComponentsSettings');

const fixtureTheme = name => path.resolve(__dirname, '__fixtures__', 'app', 'themes', name);

// Paths reach the assertions with the separator of the platform the tests run on.
const escapeForRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const THEME_PATH = fixtureTheme('theme-test');

describe('getComponentsSettings', () => {
  describe('widget configs', () => {
    it('reads the config file that belongs to a widget', () => {
      const { widgetsV2 } = getComponentsSettings(THEME_PATH);

      expect(widgetsV2['@fixture/ext/AlphaWidget']).toEqual({
        path: 'ext-fixture/frontend/widgets/AlphaWidget',
        config: {
          layout: {
            applyMediaMargins: {
              top: true,
              bottom: true,
            },
          },
        },
      });
    });

    it('keeps sections it does not know out of the config', () => {
      const { widgetsV2 } = getComponentsSettings(THEME_PATH);

      // The fixture declares a "$schema" next to its layout, which is an editor helper that has no
      // business in the config that gets injected into the app.
      expect(widgetsV2['@fixture/ext/AlphaWidget']).toHaveProperty('config.layout');
      expect(widgetsV2['@fixture/ext/AlphaWidget'].config).not.toHaveProperty('$schema');
    });

    it('leaves a widget without a config file alone', () => {
      const { widgetsV2 } = getComponentsSettings(THEME_PATH);

      expect(widgetsV2['@fixture/ext/BetaWidget']).toEqual({
        path: 'ext-fixture/frontend/widgets/BetaWidget',
      });
    });

    it('fails on a config file that cannot be parsed', () => {
      expect(() => getComponentsSettings(fixtureTheme('theme-unparsable')))
        .toThrow(new RegExp(`${escapeForRegExp(path.join('UnparsableWidget', 'config.json'))}" could not be read`));
    });

    it('fails on a config file that does not match the schema', () => {
      expect(() => getComponentsSettings(fixtureTheme('theme-invalid')))
        .toThrow(/must NOT have additional properties/);
    });

    it('names the widget of an invalid config', () => {
      expect(() => getComponentsSettings(fixtureTheme('theme-invalid')))
        .toThrow(/ext-broken\/frontend\/widgets\/InvalidWidget/);
      // The widget is named by its entry from the components config, which always uses forward
      // slashes, so this one is not affected by the separator of the platform.
    });

    it('reads the config of widgets the PWA provides', () => {
      const { widgetsV2 } = getComponentsSettings(THEME_PATH);

      expect(widgetsV2['@shopgate/widgets/imageWidget'].config).toEqual({
        layout: { applyMediaMargins: true },
      });
      expect(widgetsV2['@shopgate/widgets/richTextWidget']).not.toHaveProperty('config');
    });

    it('does not add configs to the widgets of the v1 system', () => {
      const { widgets } = getComponentsSettings(THEME_PATH);

      expect(widgets['@fixture/ext/LegacyWidget']).toEqual({
        path: 'ext-fixture/frontend/widgets/LegacyWidget',
      });
    });

    it('adds configs to v1 extension widgets that the v2 system renders', () => {
      const { widgetsV2 } = getComponentsSettings(THEME_PATH);

      expect(widgetsV2['@fixture/ext/LegacyWidget'].config).toEqual({
        layout: { applyMediaMargins: true },
      });
    });
  });

  describe('development builds', () => {
    afterEach(() => {
      jest.resetModules();
    });

    it('prefers the sources of an extension that is attached as a build', () => {
      jest.resetModules();
      jest.doMock('./variables', () => ({ isDev: true }));

      // eslint-disable-next-line global-require
      const { widgetsV2 } = require('./getComponentsSettings')(THEME_PATH);

      expect(widgetsV2['@fixture/ext/DistWidget'].config).toEqual({
        layout: { applyMediaMargins: { left: true } },
      });
    });

    it('ignores the sources outside of development', () => {
      const { widgetsV2 } = getComponentsSettings(THEME_PATH);

      expect(widgetsV2['@fixture/ext/DistWidget']).not.toHaveProperty('config');
    });
  });

  describe('getWidgetConfigDependencies', () => {
    const { getWidgetConfigDependencies } = getComponentsSettings;

    it('lists the config files that exist', () => {
      const { fileDependencies } = getWidgetConfigDependencies(THEME_PATH);

      expect(fileDependencies).toContain(path.join(
        __dirname,
        '__fixtures__/app/extensions/ext-fixture/frontend/widgets/AlphaWidget/config.json'
      ));
    });

    it('lists the config files a widget could still get', () => {
      const { missingDependencies } = getWidgetConfigDependencies(THEME_PATH);

      expect(missingDependencies).toContain(path.join(
        __dirname,
        '__fixtures__/app/extensions/ext-fixture/frontend/widgets/BetaWidget/config.json'
      ));
    });

    it('watches the components config of the theme', () => {
      const { fileDependencies } = getWidgetConfigDependencies(THEME_PATH);

      expect(fileDependencies).toContain(path.join(THEME_PATH, 'config', 'components.json'));
    });

    it('reports absolute paths without duplicates', () => {
      const { fileDependencies, missingDependencies } = getWidgetConfigDependencies(THEME_PATH);
      const all = [...fileDependencies, ...missingDependencies];

      expect(all.every(dependency => path.isAbsolute(dependency))).toBe(true);
      expect(all).toHaveLength(new Set(all).size);
    });

    it('does not read the configs, so a broken one does not break the build setup', () => {
      expect(() => getWidgetConfigDependencies(fixtureTheme('theme-invalid'))).not.toThrow();
      expect(getWidgetConfigDependencies(fixtureTheme('theme-invalid')).fileDependencies)
        .toContain(path.join(
          __dirname,
          '__fixtures__/app/extensions/ext-broken/frontend/widgets/InvalidWidget/config.json'
        ));
    });

    it('reports nothing for a theme without a components config', () => {
      expect(getWidgetConfigDependencies(path.resolve(THEME_PATH, 'nope'))).toEqual({
        fileDependencies: [],
        missingDependencies: [],
      });
    });
  });

  describe('component mapping', () => {
    it('merges the widgets of the theme into the v1 widgets', () => {
      const { widgets } = getComponentsSettings(THEME_PATH);

      expect(widgets['@fixture/theme/ThemeWidget']).toEqual({ path: 'ThemeWidget' });
    });

    it('merges the widgets of the PWA into the v2 widgets', () => {
      const { widgetsV2 } = getComponentsSettings(THEME_PATH);

      expect(widgetsV2['@shopgate/widgets/htmlWidget']).toEqual({
        path: '@shopgate/engage/page/widgets/HTML',
      });
    });

    it('passes other component types through', () => {
      const { portals } = getComponentsSettings(THEME_PATH);

      expect(portals['@fixture/ext/SomePortal']).toEqual({
        path: 'ext-fixture/frontend/portals/Some',
        target: 'app.routes',
      });
    });

    it('drops the entries of ignored extensions', () => {
      const { reducers } = getComponentsSettings(THEME_PATH);

      expect(reducers).toEqual({});
    });

    it('returns nothing for a theme without a components config', () => {
      expect(getComponentsSettings(path.resolve(THEME_PATH, 'does-not-exist'))).toEqual({});
    });
  });
});
