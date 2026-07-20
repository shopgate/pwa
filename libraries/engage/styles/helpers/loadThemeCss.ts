import {
  withScope,
  captureMessage,
  Severity as SentrySeverity,
} from '@sentry/browser';
import { appConfig } from '@shopgate/engage';

const REQUEST_TIMEOUT = 3000;
const LINK_TAG_ID = 'theme-css';
const INSERTION_POINT_SELECTOR = 'meta[name="theme-css-insertion-point"]';

/**
 * Inserts the link at the theme css insertion point, which the html template declares between the
 * emotion insertion point and the preview one. That position is what makes the cascade order
 * structural rather than incidental: every tss style is pinned above it, and the admin preview
 * pins its style tag to the anchor below it.
 *
 * Falls back to appending when the meta is absent - a head without the anchor still yields the
 * desired order for anything that was already inserted, it just no longer guarantees it.
 * @param linkTag The link tag to insert.
 */
const insertLinkTag = (linkTag: HTMLLinkElement) => {
  const insertionPoint = document.querySelector(INSERTION_POINT_SELECTOR);

  if (!insertionPoint) {
    document.head.appendChild(linkTag);
    return;
  }

  insertionPoint.parentNode?.insertBefore(linkTag, insertionPoint.nextSibling);
};

/**
 * Loads the theme css file. It overrides the css custom properties that are generated during
 * theme initialization, so it has to win the cascade against them - see `insertLinkTag` for how
 * that order is established.
 *
 * A link applies at its position in the dom rather than at the time it finished loading, so the
 * timeout below only decides how long app start waits - never which styles win.
 *
 * Resolves when the file loaded, when it failed, or when REQUEST_TIMEOUT elapsed - it never
 * rejects, since the file is not guaranteed to exist and must not be able to block app start.
 * @returns A promise that resolves once the file settled.
 */
export const loadThemeCss = (): Promise<void> => new Promise((resolve) => {
  const { themeCssUrl: href } = appConfig as { themeCssUrl?: string | null };

  if (!href) {
    resolve();
    return;
  }

  let settled = false;
  let timeout: ReturnType<typeof setTimeout>;

  /**
   * Resolves the promise once, whichever of load / error / timeout comes first.
   */
  const settle = () => {
    if (settled) {
      return;
    }

    settled = true;
    clearTimeout(timeout);
    resolve();
  };

  /**
   * Starts the fallback that keeps app start from waiting on a stalled request. The link is
   * deliberately left in place when the timeout hits: it still applies once it eventually loads,
   * it just no longer holds up app start.
   */
  const startTimeoutFallback = () => {
    timeout = setTimeout(() => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Warning);
        scope.setExtra('themeCssUrl', href);
        scope.setExtra('timeout', REQUEST_TIMEOUT);
        captureMessage('Fetching theme css took too long');
      });

      settle();
    }, REQUEST_TIMEOUT);
  };

  const existingTag = document.querySelector<HTMLLinkElement>(`#${LINK_TAG_ID}`);

  if (existingTag) {
    // Already loaded
    if (existingTag.sheet) {
      resolve();
      return;
    }

    // Still loading - a stalled request must not leave the promise pending, so arm the timeout
    // here too rather than relying on the load / error events alone.
    existingTag.addEventListener('load', settle);
    existingTag.addEventListener('error', settle);
    startTimeoutFallback();
    return;
  }

  const linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.type = 'text/css';
  linkTag.href = href;
  linkTag.id = LINK_TAG_ID;

  linkTag.onload = settle;

  linkTag.onerror = () => {
    withScope((scope) => {
      scope.setLevel(SentrySeverity.Error);
      scope.setExtra('themeCssUrl', href);
      captureMessage('Fetching theme css failed');
    });

    settle();
  };

  insertLinkTag(linkTag);

  startTimeoutFallback();
});
