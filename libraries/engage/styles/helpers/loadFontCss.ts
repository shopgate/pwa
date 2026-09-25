import {
  withScope,
  captureMessage,
  Severity as SentrySeverity,
} from '@sentry/browser';

const REQUEST_TIMEOUT = 3000;
const LINK_TAG_CLASS = 'font-css';
const URL_ATTRIBUTE = 'data-font-css-url';
const INSERTION_POINT_SELECTOR = 'meta[name="font-css-insertion-point"]';

/**
 * Reads the font css links that are currently in the document, in document order.
 * @returns The link tags.
 */
const getExistingTags = (): HTMLLinkElement[] =>
  Array.from(document.querySelectorAll<HTMLLinkElement>(`link.${LINK_TAG_CLASS}`));

/**
 * Inserts a tag after the passed sibling, or appends it when there is none.
 * @param tag The tag to insert.
 * @param sibling The node to insert after.
 */
const insertAfter = (tag: Element, sibling: Element | null) => {
  if (!sibling) {
    document.head.appendChild(tag);
    return;
  }

  sibling.parentNode?.insertBefore(tag, sibling.nextSibling);
};

/**
 * Loads a single font css file and inserts its link after the passed sibling. The font css
 * insertion point sits between the emotion one and the theme css one, so these files override the
 * custom properties that theme initialization generates while the theme css file still overrides
 * them in turn. Falls back to appending when the meta is absent.
 *
 * A link applies at its position in the dom rather than at the time it finished loading, so the
 * timeout below only decides how long app start waits - never which styles win. The tag is left in
 * place when it hits, so the file still applies once it eventually loads.
 * @param href The url to load.
 * @param sibling The node to insert after.
 * @returns The inserted link tag and a promise that settles on load, error or timeout.
 */
const loadOne = (href: string, sibling: Element | null) => {
  const linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.type = 'text/css';
  linkTag.href = href;
  linkTag.className = LINK_TAG_CLASS;
  linkTag.setAttribute(URL_ATTRIBUTE, href);

  const settled = new Promise<void>((resolve) => {
    let done = false;
    let timeout: ReturnType<typeof setTimeout>;

    /**
     * Resolves the promise once, whichever of load / error / timeout comes first.
     */
    const settle = () => {
      if (done) {
        return;
      }

      done = true;
      clearTimeout(timeout);
      resolve();
    };

    linkTag.onload = settle;

    linkTag.onerror = () => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Error);
        scope.setExtra('fontCssUrl', href);
        captureMessage('Fetching font css failed');
      });

      settle();
    };

    timeout = setTimeout(() => {
      withScope((scope) => {
        scope.setLevel(SentrySeverity.Warning);
        scope.setExtra('fontCssUrl', href);
        scope.setExtra('timeout', REQUEST_TIMEOUT);
        captureMessage('Fetching font css took too long');
      });

      settle();
    }, REQUEST_TIMEOUT);
  });

  insertAfter(linkTag, sibling);

  return { linkTag, settled };
};

/**
 * Syncs the font css links in the document with the passed urls. Tags for urls that are no longer
 * configured are removed, and the remaining ones end up in the dom in the order they were passed -
 * so the global file, passed first, stays above the per variant ones however they were ordered
 * before.
 *
 * Idempotent by design: the admin preview re-sends the app settings while a merchant edits them, so
 * this runs again on every settings update. A tag that is already in place is left untouched, and a
 * tag for a url that is still configured is moved rather than recreated, which would re-request the
 * file.
 *
 * A url is only ever loaded once. Configuring the same file globally and for a variant is normal,
 * and a second link tag for it would apply the same `@font-face` rules twice.
 *
 * Resolves once every newly added file settled, and never rejects - a font file is not guaranteed
 * to exist and must not be able to block app start.
 * @param urls The font css urls to load, in cascade order. Duplicates are dropped, keeping the
 * first occurrence so the cascade order is preserved.
 * @returns A promise that resolves once the new files settled.
 */
export const loadFontCss = async (urls: string[] = []): Promise<void> => {
  const wanted = Array.from(new Set(urls));
  const wantedUrls = new Set(wanted);
  const kept = new Map<string, HTMLLinkElement>();

  getExistingTags().forEach((tag) => {
    const url = tag.getAttribute(URL_ATTRIBUTE) || '';

    if (wantedUrls.has(url) && !kept.has(url)) {
      kept.set(url, tag);
      return;
    }

    tag.remove();
  });

  let sibling: Element | null = document.querySelector(INSERTION_POINT_SELECTOR);
  const pending: Array<Promise<void>> = [];

  wanted.forEach((url) => {
    const existing = kept.get(url);

    if (existing) {
      if (existing.previousElementSibling !== sibling) {
        insertAfter(existing, sibling);
      }

      sibling = existing;
      return;
    }

    const { linkTag, settled } = loadOne(url, sibling);
    sibling = linkTag;
    pending.push(settled);
  });

  await Promise.all(pending);
};
