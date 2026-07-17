import { render } from '@testing-library/react';
import useLocalStorage from '@shopgate/engage/core/hooks/useLocalStorage';
import { logger } from '@shopgate/engage/core/helpers';
import { isFrontendSettingsAdminPreviewActive } from '@shopgate/engage/admin-preview/helpers';
import ThemeProvider from './ThemeProvider';
import type { ColorSchemeContextValue } from './ColorSchemeContext';
import useColorScheme from '../hooks/useColorScheme';
import type { ColorSchemeName, ThemeInternal } from '../createTheme';

const mockedSetActiveColorScheme = jest.fn();
const mockedSetValue = jest.fn();

/**
 * The value the mocked useLocalStorage holds. Assertions read this to check what the provider
 * actually persisted.
 */
let persistedColorScheme: string | null = null;

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

const themeStub = {
  defaultColorScheme: 'light',
  setActiveColorScheme: mockedSetActiveColorScheme,
  generateStyleSheets: () => [],
} as unknown as ThemeInternal;

/**
 * Renders the provider with a persisted color scheme and captures the color scheme context.
 * @param persisted The value returned by the persisted color scheme storage.
 * @returns The captured color scheme context value.
 */
const renderProvider = (persisted: string | null) => {
  persistedColorScheme = persisted;

  // Mirrors useLocalStorage's setter: it resolves an updater against the currently stored value.
  mockedSetValue.mockImplementation((value) => {
    persistedColorScheme = typeof value === 'function' ? value(persistedColorScheme) : value;
  });
  (useLocalStorage as jest.Mock).mockReturnValue([persistedColorScheme, mockedSetValue]);

  let context: ColorSchemeContextValue | undefined;

  /**
   * Captures the color scheme context from inside the provider.
   * @returns Nothing renderable.
   */
  const Consumer = () => {
    context = useColorScheme();
    return null;
  };

  render(
    <ThemeProvider theme={themeStub}>
      <Consumer />
    </ThemeProvider>
  );

  return context as ColorSchemeContextValue;
};

describe('engage > styles > theme > providers > ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applying the color scheme', () => {
    it('should apply the persisted color scheme to the theme', () => {
      renderProvider('dark');

      expect(mockedSetActiveColorScheme).toHaveBeenCalledWith('dark');
    });

    it('should not apply anything when no color scheme is persisted', () => {
      renderProvider(null);

      expect(mockedSetActiveColorScheme).not.toHaveBeenCalled();
    });
  });

  describe('color scheme context', () => {
    it('should expose the supported modes', () => {
      const { modes } = renderProvider('light');

      expect(modes).toEqual(['light', 'dark']);
    });

    it('should expose the active mode', () => {
      const { mode } = renderProvider('dark');

      expect(mode).toBe<ColorSchemeName>('dark');
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

    it('should not persist an unknown color scheme', () => {
      const { setMode } = renderProvider('light');

      setMode('blue' as ColorSchemeName);

      expect(persistedColorScheme).toBe('light');
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should clear the stored preference when set to null', () => {
      const { setMode } = renderProvider('dark');

      setMode(null);

      expect(persistedColorScheme).toBeNull();
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should resolve an updater function and persist a supported result', () => {
      const { setMode } = renderProvider('light');

      setMode(current => (current === 'light' ? 'dark' : 'light'));

      expect(persistedColorScheme).toBe('dark');
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should reject an unsupported result returned by an updater function', () => {
      const { setMode } = renderProvider('light');

      setMode(() => 'blue' as ColorSchemeName);

      expect(persistedColorScheme).toBe('light');
      expect(logger.warn).toHaveBeenCalled();
    });
  });
});
