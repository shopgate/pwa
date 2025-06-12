import { Theme } from '..';

export const ThemeContext: React.Context<Theme>;

export interface ThemeProviderProps<Theme = Theme> {
  children: React.ReactNode;
  /**
   * The theme object to provide to the context.
   */
  theme: Partial<Theme> | ((outerTheme: Theme) => Theme);
}

/**
 * The ThemeProvider component provides the theme context to its children.
 */
export default function ThemeProvider<T = Theme>(
  props: ThemeProviderProps<T>
): React.ReactElement<ThemeProviderProps<T>>;
