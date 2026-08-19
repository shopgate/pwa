import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import useLocalStorage from '@shopgate/engage/core/hooks/useLocalStorage';
import { logger } from '@shopgate/engage/core/helpers';
import { isFrontendSettingsAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import ThemeProvider from './ThemeProvider';
import type { ColorSchemeContextValue } from './ColorSchemeContext';
import useColorScheme from '../hooks/useColorScheme';
import useMediaQuery from '../hooks/useMediaQuery';
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
}));

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

jest.mock('../hooks/useMediaQuery', () => jest.fn(() => false));

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
 * @param persisted The color scheme the visitor picked themselves, if any.
 * @param configured The color scheme configured within the app settings.
 * @param prefersDark Whether the operating system asks for a dark color scheme.
 * @returns The captured color scheme context value.
 */
const renderProvider = (
  persisted: string | null,
  configured = 'light',
  prefersDark = false
) => {
  persistedColorScheme = persisted;

  // Mirrors useLocalStorage's setter: it resolves an updater against the currently stored value.
  mockedSetValue.mockImplementation((value) => {
    persistedColorScheme = typeof value === 'function' ? value(persistedColorScheme) : value;
  });
  (useLocalStorage as jest.Mock).mockImplementation(() => [persistedColorScheme, mockedSetValue]);
  (useSelector as jest.Mock).mockReturnValue(configured);
  (useMediaQuery as jest.Mock).mockReturnValue(prefersDark);

  let context: ColorSchemeContextValue | undefined;

  /**
   * Captures the color scheme context from inside the provider.
   * @returns Nothing renderable.
   */
  const Consumer = () => {
    context = useColorScheme();
    return null;
  };

  // A fresh element per render, so the memoized provider does not bail out on the rerender below.
  const element = () => (
    <ThemeProvider theme={themeStub}>
      <Consumer />
    </ThemeProvider>
  );

  const { rerender } = render(element());

  rerenderWithConfigured = (nextConfigured) => {
    (useSelector as jest.Mock).mockReturnValue(nextConfigured);
    rerender(element());
  };

  return context as ColorSchemeContextValue;
};

describe('engage > styles > theme > providers > ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applying the color scheme', () => {
    it('should apply the color scheme the visitor picked', () => {
      renderProvider('dark', 'light');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
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

    it('should keep the picked color scheme when the configured one changes', () => {
      renderProvider('light', 'light');

      rerenderWithConfigured('dark');

      expect(mockedSetActiveColorScheme).toHaveBeenLastCalledWith('light');
    });

    it('should fall back to the theme default when the configured scheme is not supported', () => {
      renderProvider(null, 'blue');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith(themeStub.defaultColorScheme);
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('system color scheme', () => {
    it('should apply the light scheme when the system asks for it', () => {
      renderProvider(null, 'system', false);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should apply the dark scheme when the system asks for it', () => {
      renderProvider(null, 'system', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should not override the color scheme the visitor picked', () => {
      renderProvider('light', 'system', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('light');
    });

    it('should follow the system when the visitor picked it', () => {
      renderProvider('system', 'light', true);

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should ask for the operating system preference', () => {
      renderProvider(null, 'system');

      expect(useMediaQuery).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
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
      const { mode, activeColorScheme } = renderProvider('dark');

      expect(mode).toBe<ColorSchemeMode>('dark');
      expect(activeColorScheme).toBe<ColorSchemeName>('dark');
    });

    it('should expose the configured mode while the visitor picked none', () => {
      const { mode, activeColorScheme } = renderProvider(null, 'dark');

      expect(mode).toBe<ColorSchemeMode>('dark');
      expect(activeColorScheme).toBe<ColorSchemeName>('dark');
    });

    it('should expose the system mode next to the scheme it resolves to', () => {
      const { mode, activeColorScheme } = renderProvider('system', 'light', true);

      expect(mode).toBe<ColorSchemeMode>('system');
      expect(activeColorScheme).toBe<ColorSchemeName>('dark');
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
