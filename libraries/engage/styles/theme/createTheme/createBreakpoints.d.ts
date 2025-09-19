export type Breakpoint =  'xs' | 'sm' | 'md' | 'lg' | 'xl';
export const keys: Breakpoint[];

export interface Breakpoints {
  keys: Breakpoint[];
  /**
   * Each breakpoint (a key) matches with a fixed screen width (a value).
   * @default
   * {
   *    // extra-small
   *    xs: 0,
   *    // small
   *    sm: 480,
   *    // medium
   *    md: 768,
   *    // large
   *    lg: 1024,
   *    // extra-large
   *    xl: 1280,
   * }
   */
  values: { [key in Breakpoint]: number };
  /**
   * @param key - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
   * @returns A media query string which matches screen widths greater than the screen size given by the breakpoint key (inclusive).
   * @example
   * ```js
   * const styles = (theme) => ({
   *   root: {
   *     backgroundColor: 'blue',
   *     // Matches "md" and above
   *     [theme.breakpoints.up('md')]: {
   *         backgroundColor: 'red',
   *     }
   *   }
   * })
   * ```
   */
  up: (key: Breakpoint | number) => string;
  /**
   * @param key - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
   * @returns A media query string which matches screen widths less than the screen size given by the breakpoint key (exclusive).
   * @example
   * ```js
   * const styles = (theme) => ({
   *   root: {
   *     backgroundColor: 'blue',
   *     // Matches "xs" and "sm"
   *     [theme.breakpoints.down('md')]: {
   *         backgroundColor: 'red',
   *     }
   *   }
   * })
   * ```
   */
  down: (key: Breakpoint | number) => string;
  /**
   * @param start - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
   * @param end - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
   * @returns A media query string which matches screen widths greater than
   *          the screen size given by the breakpoint key in the first argument (inclusive) and less than the screen size given by the breakpoint key in the second argument (exclusive).
   * @example
   * ```js
   * const styles = (theme) => ({
   *   root: {
   *     backgroundColor: 'blue',
   *     // Matches "sm" and "md"
   *     [theme.breakpoints.between('sm', 'lg')]: {
   *         backgroundColor: 'red',
   *     }
   *   }
   * })
   * ```
   */
  between: (start: Breakpoint | number, end: Breakpoint | number) => string;
  /**
   * @param key - A breakpoint key (`xs`, `sm`, etc.) or a screen width number in px.
   * @returns A media query string which matches screen widths starting from
   *          the screen size given by the breakpoint key (inclusive) and stopping at the screen size given by the next breakpoint key (exclusive).
   * @example
   * ```js
   * const styles = (theme) => ({
   *   root: {
   *     backgroundColor: 'blue',
   *     // Matches "sm"
   *     [theme.breakpoints.only('sm')]: {
   *         backgroundColor: 'red',
   *     }
   *   }
   * })
   * ```
   */
  only: (key: Breakpoint) => string;
  /**
   * @param key - A breakpoint key (`xs`, `sm`, etc.).
   * @returns A media query string which matches screen widths stopping at
   *          the screen size given by the breakpoint key (exclusive) and starting at the screen size given by the next breakpoint key (inclusive).
   * @example
   * ```js
   * const styles = (theme) => ({
   *   root: {
   *     backgroundColor: 'blue',
   *     // Matches "xs", "md", "lg", and "xl"
   *     [theme.breakpoints.not('sm')]: {
   *         backgroundColor: 'red',
   *     }
   *   }
   * })
   * ```
   */
  not: (key: Breakpoint) => string;
}

export default function createBreakpoints(): Breakpoints;
