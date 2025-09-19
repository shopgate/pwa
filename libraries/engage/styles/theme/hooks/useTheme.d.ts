import { type Theme } from '..';

export type { Theme } from '..';

/**
 * Returns the theme object.
 */
export default function useTheme<T = Theme>(): T;
