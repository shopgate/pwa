/**
 * `css-spring` ships no types. It calculates the keyframes of a spring animation between two
 * sets of CSS properties.
 */
declare module 'css-spring' {
  /**
   * Spring physics of the animation.
   */
  interface SpringOptions {
    stiffness?: number;
    damping?: number;
    precision?: number;
  }

  export default function spring(
    from: Record<string, string | number>,
    to: Record<string, string | number>,
    options?: SpringOptions
  ): Record<string, Record<string, string | number>>;
}
