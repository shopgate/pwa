import { Router } from '@virtuous/conductor';

/**
 * `@virtuous/conductor` ships types for the `Router` class but not for the singleton instance it
 * exports at runtime. Declared here so that TypeScript consumers can use it.
 */
declare module '@virtuous/conductor' {
  export const router: Router;
}
