import { pwaDidAppear$, pwaDidDisappear$ } from '@shopgate/pwa-common/streams/app';

/**
 * Emits when the PWA visibility changes
 */
export const pwaVisibility$ = pwaDidAppear$.merge(pwaDidDisappear$);

/**
 * Export the streams again from here, since e.g. checkout extensions import them.
 * @deprecated
 */
export { pwaDidAppear$, pwaDidDisappear$ };
