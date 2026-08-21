import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import useLocalStorage from '@shopgate/engage/core/hooks/useLocalStorage';
import { logger } from '@shopgate/engage/core/helpers';
import { isFrontendSettingsAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import { getCanSelectColorScheme } from '@shopgate/engage/settings/selectors/appSettings';
import { getIsColorSchemeSelectionEnabled } from '@shopgate/engage/development/selectors';
import ThemeProvider from './ThemeProvider';
import type { ColorSchemeContextValue } from './ColorSchemeContext';
import useColorScheme from '../hooks/useColorScheme';
import { useMatchMedia } from '../hooks/useMediaQuery';
import type { ColorSchemeMode, ColorSchemeName, ThemeInternal } from '../createTheme';

const mockedSetActiveColorScheme = jest.fn();
const mockedSetValue = jest.fn();

/**
 * The value the mocked useLocalStorage holds. Assertions read this to check what the provider
 * actually persisted.
 */
let persistedColorScheme: string | null = null;

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getDefaultColorSchemeMode: jest.fn(),
  getCanSelectColorScheme: jest.fn(),
}));

jest.mock('@shopgate/engage/development/selectors', () => ({
  getIsColorSchemeSelectionEnabled: jest.fn(),
}));

/**
 * Mirrors how the settings layer maps the appearance setting onto what the provider consumes: the
 * theme only ever sees its own modes, so `selectable` reaches it as `system`.
 * @param configured The color scheme mode configured within the app settings.
 * @param developmentSelection Whether the development setting simulates a selectable appearance.
 * @returns The mocked useSelector implementation.
 */
const selectorsFor = (configured: string, developmentSelection = false) =>
  (selector: unknown) => {
    if (selector === getCanSelectColorScheme) {
      return configured === 'selectable';
    }

    if (selector === getIsColorSchemeSelectionEnabled) {
      return developmentSelection;
    }

    return (configured === 'selectable' && 'system') || configured;
  };

jest.mock('@shopgate/engage/core/hooks/useLocalStorage', () => jest.fn());

jest.mock('@shopgate/engage/core/helpers', () => ({
  logger: { warn: jest.fn() },
}));

jest.mock('@shopgate/engage/styles', () => ({
  GlobalStyles: () => null,
}));

jest.mock('@shopgate/engage/admin-preview/helpers', () => ({
  isFrontendSettingsAdminPreviewActive: jest.fn(() => false),
}));

jest.mock('@shopgate/engage/admin-preview/components', () => ({
  FrontendSettingsPreviewBridge: () => null,
}));

jest.mock('./ActiveBreakpointProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../hooks/useMediaQuery', () => ({
  useMatchMedia: jest.fn(() => false),
}));

const themeStub = {
  defaultColorScheme: 'light',
  // The provider derives the selectable schemes from the ones the theme actually resolved.
  colorSchemes: { light: {}, dark: {} },
  setActiveColorScheme: mockedSetActiveColorScheme,
  generateStyleSheets: () => [],
} as unknown as ThemeInternal;

/**
 * Re-renders the provider with another configured color scheme. Set up by renderProvider.
 */
let rerenderWithConfigured: (configured: string) => void;

/**
 * Renders the provider and captures the color scheme context.
 * @param persisted The color scheme mode the visitor picked themselves, if any.
 * @param configured The appearance configured within the app settings: a color scheme, or
 * 'selectable' to let the visitor pick one.
 * @param prefersDark Whether the operating system asks for a dark color scheme.
 * @param themeOverrides Theme properties to override for this render.
 * @param developmentSelection Whether the development setting simulates a selectable appearance.
 * @returns The captured color scheme context value.
 */
const renderProvider = (
  persisted: string | null,
  configured = 'light',
  prefersDark = false,
  themeOverrides: Partial<ThemeInternal> = {},
  developmentSelection = false
) => {
  persistedColorScheme = persisted;

  // Mirrors useLocalStorage's setter: it resolves an updater against the currently stored value.
  mockedSetValue.mockImplementation((value) => {
    persistedColorScheme = typeof value === 'function' ? value(persistedColorScheme) : value;
  });
  (useLocalStorage as jest.Mock).mockImplementation(() => [persistedColorScheme, mockedSetValue]);
  (useSelector as jest.Mock).mockImplementation(selectorsFor(configured, developmentSelection));
  (useMatchMedia as jest.Mock).mockReturnValue(prefersDark);

  let context: ColorSchemeContextValue | undefined;

  /**
   * Captures the color scheme context from inside the provider.
   * @returns Nothing renderable.
   */
  const Consumer = () => {
    context = useColorScheme();
    return null;
  };

  const theme = { ...themeStub, ...themeOverrides } as ThemeInternal;

  // A fresh element per render, so the memoized provider does not bail out on the rerender below.
  const element = () => (
    <ThemeProvider theme={theme}>
      <Consumer />
    </ThemeProvider>
  );

  const { rerender } = render(element());

  rerenderWithConfigured = (nextConfigured) => {
    (useSelector as jest.Mock).mockImplementation(selectorsFor(nextConfigured));
    rerender(element());
  };

  return context as ColorSchemeContextValue;
};

describe('engage > styles > theme > providers > ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // clearAllMocks keeps return values, so the preview flag is restored for every test.
    (isFrontendSettingsAdminPreviewActive as jest.Mock).mockReturnValue(false);
  });

  describe('applying the color scheme', () => {
    it('should apply the color scheme the visitor picked', () => {
      renderProvider('dark', 'selectable');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
    });

    it('should ignore the picked scheme while a fixed one is configured', () => {
      renderProvider('dark', 'light');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
    });

    it('should apply the configured color scheme when the visitor picked none', () => {
      renderProvider(null, 'dark');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
    });

    it('should apply a configured color scheme that changes after mount', () => {
      renderProvider(null, 'light');

      rerenderWithConfigured('dark');

      expect(mockedSetActiveColorScheme).toHaveBeenLastCalledWith('dark');
      expect(persistedColorScheme).toBeNull();
    });

    it('should keep the picked color scheme while visitors may select one', () => {
      renderProvider('light', 'selectable', true);

      expect(mockedSetActiveColorScheme).toHaveBeenLastCalledWith('light');
    });

    it('should drop the picked scheme once a fixed one is configured', () => {
      renderProvider('dark', 'selectable');

      expect(mockedSetActiveColorScheme).toHaveBeenLastCalledWith('dark');

      rerenderWithConfigured('light');

      expect(mockedSetActiveColorScheme).toHaveBeenLastCalledWith('light');
    });

    it('should fall back to the theme default when the configured scheme is not supported', () => {
      renderProvider(null, 'blue');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith(themeStub.defaultColorScheme);
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('blue'));
    });

    it('should name the resolved scheme when the system asks for an unsupported one', () => {
      renderProvider(null, 'selectable', true, {
        colorSchemes: { light: {} },
      } as unknown as Partial<ThemeInternal>);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith(themeStub.defaultColorScheme);
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('dark'));
    });
  });

  // The dark scheme may only ever render where the merchant configured `dark` or `selectable`.
  // Anything else that can ask for it - a stale pick, the operating system, a browser that enforces
  // dark by setting the media query - has to lose against a binding scheme.
  describe('binding the color scheme to the configured setting', () => {
    it('should stay light while the system asks for dark', () => {
      renderProvider(null, 'light', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
      expect(mockedSetActiveColorScheme).not.toHaveBeenCalledWith('dark');
    });

    it('should stay light while a stored pick follows the system that asks for dark', () => {
      renderProvider('system', 'light', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
      expect(mockedSetActiveColorScheme).not.toHaveBeenCalledWith('dark');
    });

    it('should stay light while a stored pick asks for dark', () => {
      renderProvider('dark', 'light', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
      expect(mockedSetActiveColorScheme).not.toHaveBeenCalledWith('dark');
    });

    it('should follow the system that asks for dark once visitors may select a scheme', () => {
      renderProvider(null, 'selectable', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
    });

    it('should apply dark when it is the configured scheme', () => {
      renderProvider(null, 'dark', false);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
    });
  });

  // The development setting is the one sanctioned way past a binding scheme. It simulates the
  // `selectable` appearance, so a development build resolves the scheme exactly like a shop that
  // configured it - the selector behind it is false outside development builds.
  describe('color scheme selection enabled for development', () => {
    it('should follow the system while a fixed scheme is configured', () => {
      renderProvider(null, 'light', true, {}, true);

      expect(mockedSetActiveColorScheme).toHaveBeenLastCalledWith('dark');
    });

    it('should let a picked scheme win over the system', () => {
      renderProvider('light', 'light', true, {}, true);

      expect(mockedSetActiveColorScheme).toHaveBeenLastCalledWith('light');
    });

    it('should let visitors select a scheme', () => {
      const { canSelectColorScheme } = renderProvider(null, 'light', false, {}, true);

      expect(canSelectColorScheme).toBe(true);
    });
  });

  describe('selectable color scheme', () => {
    it('should apply the light scheme when the system asks for it', () => {
      renderProvider(null, 'selectable', false);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should apply the dark scheme when the system asks for it', () => {
      renderProvider(null, 'selectable', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should not override the color scheme the visitor picked', () => {
      renderProvider('light', 'selectable', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
    });

    it('should follow the system when the visitor picked it', () => {
      renderProvider('system', 'selectable', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should ask for the operating system preference', () => {
      renderProvider(null, 'selectable');

      expect(useMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should apply a picked scheme within the frontend settings preview', () => {
      (isFrontendSettingsAdminPreviewActive as jest.Mock).mockReturnValue(true);

      renderProvider('dark', 'light');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('color scheme context', () => {
    it('should expose the modes that can be set', () => {
      const { modes } = renderProvider('light');

      expect(modes).toEqual(['light', 'dark', 'system']);
    });

    it('should expose the configured default mode', () => {
      const { defaultMode } = renderProvider(null, 'dark');

      expect(defaultMode).toBe('dark');
    });

    it('should expose the mode the visitor picked', () => {
      const { mode, activeColorScheme } = renderProvider('dark', 'selectable');

      expect(mode).toBe<ColorSchemeMode>('dark');
      expect(activeColorScheme).toBe<ColorSchemeName>('dark');
    });

    it('should expose the configured mode while the visitor picked none', () => {
      const { mode, activeColorScheme } = renderProvider(null, 'dark');

      expect(mode).toBe<ColorSchemeMode>('dark');
      expect(activeColorScheme).toBe<ColorSchemeName>('dark');
    });

    it('should expose the system mode next to the scheme it resolves to', () => {
      const { mode, activeColorScheme } = renderProvider(null, 'selectable', true);

      expect(mode).toBe<ColorSchemeMode>('system');
      expect(activeColorScheme).toBe<ColorSchemeName>('dark');
    });

    it('should tell that visitors may select a color scheme', () => {
      const { canSelectColorScheme } = renderProvider(null, 'selectable');

      expect(canSelectColorScheme).toBe(true);
    });

    it('should tell that visitors may not select a color scheme', () => {
      const { canSelectColorScheme } = renderProvider(null, 'dark');

      expect(canSelectColorScheme).toBe(false);
    });

    it('should not let visitors select a color scheme within the frontend settings preview', () => {
      (isFrontendSettingsAdminPreviewActive as jest.Mock).mockReturnValue(true);

      const { canSelectColorScheme } = renderProvider(null, 'dark');

      expect(canSelectColorScheme).toBe(false);
    });
  });

  describe('persisting the color scheme', () => {
    it('should persist the color scheme when not in the frontend settings preview', () => {
      (isFrontendSettingsAdminPreviewActive as jest.Mock).mockReturnValue(false);

      renderProvider('light');

      expect(useLocalStorage).toHaveBeenCalledWith(
        'persistedColorScheme',
        expect.objectContaining({ persist: true })
      );
    });

    it('should not persist the color scheme while in the frontend settings preview', () => {
      (isFrontendSettingsAdminPreviewActive as jest.Mock).mockReturnValue(true);

      renderProvider('light');

      expect(useLocalStorage).toHaveBeenCalledWith(
        'persistedColorScheme',
        expect.objectContaining({ persist: false })
      );
    });
  });

  describe('setMode', () => {
    it('should persist a color scheme that the theme provides', () => {
      const { setMode } = renderProvider('light');

      setMode('dark');

      expect(persistedColorScheme).toBe('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should persist the system mode', () => {
      const { setMode } = renderProvider('light');

      setMode('system');

      expect(persistedColorScheme).toBe('system');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should not persist an unknown color scheme', () => {
      const { setMode } = renderProvider('light');

      setMode('blue' as ColorSchemeMode);

      expect(persistedColorScheme).toBe('light');
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should clear the stored preference when set to null', () => {
      const { setMode } = renderProvider('dark');

      setMode(null);

      expect(persistedColorScheme).toBeNull();
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should resolve an updater against the configured mode while a pick is ignored', () => {
      const { setMode } = renderProvider('dark', 'light');

      setMode(current => (current === 'light' ? 'dark' : 'light'));

      expect(persistedColorScheme).toBe('dark');
    });

    it('should resolve an updater against the picked mode while it applies', () => {
      const { setMode } = renderProvider('dark', 'selectable');

      setMode(current => (current === 'dark' ? 'light' : 'dark'));

      expect(persistedColorScheme).toBe('light');
    });

    it('should resolve an updater against the configured mode while the visitor picked none', () => {
      const { setMode } = renderProvider(null, 'dark');

      setMode(current => (current === 'dark' ? 'light' : 'dark'));

      expect(persistedColorScheme).toBe('light');
    });

    it('should resolve an updater function and persist a supported result', () => {
      const { setMode } = renderProvider('light');

      setMode(current => (current === 'light' ? 'dark' : 'light'));

      expect(persistedColorScheme).toBe('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should reject an unsupported result returned by an updater function', () => {
      const { setMode } = renderProvider('light');

      setMode(() => 'blue' as ColorSchemeMode);

      expect(persistedColorScheme).toBe('light');
      expect(logger.warn).toHaveBeenCalled();
    });
  });
});
