import DOMPurify, { type Config } from 'dompurify';
import memoize from 'lodash/memoize';

const INLINE_TAGS = ['b', 'br', 'em', 'i', 's', 'small', 'span', 'strong', 'sub', 'sup', 'u'];

const INLINE_CONFIG: Config = {
  ALLOWED_TAGS: INLINE_TAGS,
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
};

const HTML_CONFIG: Config = {
  ALLOWED_TAGS: [...INLINE_TAGS, 'a', 'li', 'ol', 'p', 'ul'],
  ALLOWED_ATTR: ['href', 'target'],
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
};

const RICH_CONFIG: Config = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'sandbox', 'scrolling', 'target'],
};

const SVG_CONFIG: Config & { RETURN_DOM: true } = {
  USE_PROFILES: {
    svg: true,
    svgFilters: true,
  },
  RETURN_DOM: true,
};

const purifier = DOMPurify(window);

/**
 * Removes everything from an HTML string except inline formatting tags.
 * @param html The HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeInlineHtml = (html: string) => purifier.sanitize(html, INLINE_CONFIG);

/**
 * Removes everything from an HTML string except formatting tags, lists and links.
 * @param html The HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (html: string) => purifier.sanitize(html, HTML_CONFIG);

/**
 * Removes scripts, event handlers and unsafe links from rich HTML content but keeps embedded media.
 * @param html The HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeRichHtml = (html: string) => purifier.sanitize(html, RICH_CONFIG);

/**
 * Removes everything from the content of an SVG element that is not plain SVG markup.
 * @param content The content of the SVG element.
 * @returns The sanitized content.
 */
export const sanitizeSvg = memoize((content: string) => {
  const body = purifier.sanitize(`<svg>${content}</svg>`, SVG_CONFIG) as HTMLElement;

  return body.firstElementChild?.innerHTML ?? '';
});
