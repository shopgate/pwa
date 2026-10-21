import DOMPurify from 'dompurify';
import memoize from 'lodash/memoize';

const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

const HTML_TAGS = [
  'a', 'b', 'br', 'em', 'i', 'li', 'ol', 'p', 's', 'small', 'span', 'strong', 'sub', 'sup', 'u', 'ul',
];

const purifier = DOMPurify(window);

/**
 * Checks if a URL is relative or uses one of the safe protocols.
 * @param url The URL.
 * @returns Whether the URL is safe.
 */
const isSafeUrl = (url: string) => {
  try {
    return SAFE_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return true;
  }
};

purifier.addHook('uponSanitizeAttribute', (node, event) => {
  if ((event.attrName === 'href' || event.attrName === 'xlink:href') && !isSafeUrl(event.attrValue)) {
    // eslint-disable-next-line no-param-reassign
    event.keepAttr = false;
  }
});

/**
 * Removes everything from an HTML string except formatting tags, lists and links.
 * @param html The HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (html: string) => purifier.sanitize(html, {
  ALLOWED_TAGS: HTML_TAGS,
  ALLOWED_ATTR: ['href', 'target'],
});

/**
 * Removes scripts, event handlers and unsafe links from rich HTML content but keeps embedded media.
 * @param html The HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeRichHtml = (html: string) => purifier.sanitize(html, {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'sandbox', 'scrolling', 'target'],
});

/**
 * Removes everything from the content of an SVG element that is not plain SVG markup.
 * @param content The content of the SVG element.
 * @returns The sanitized content.
 */
export const sanitizeSvg = memoize((content: string) => {
  const body = purifier.sanitize(`<svg>${content}</svg>`, {
    USE_PROFILES: {
      svg: true,
      svgFilters: true,
    },
    RETURN_DOM: true,
  }) as HTMLElement;

  return body.firstElementChild?.innerHTML ?? '';
});
