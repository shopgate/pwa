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
  ADD_ATTR: ['target'],
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

const svgElementPurifier = DOMPurify(window);

let visitSvgElement: ((element: Element) => void) | null = null;

svgElementPurifier.addHook('afterSanitizeAttributes', (node) => {
  if (visitSvgElement && node.nodeType === 1 && node.nodeName !== 'BODY') {
    visitSvgElement(node as Element);
  }
});

/**
 * Removes everything from an HTML string except inline formatting tags.
 * @param html The HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeInlineHtml = (html: string) => purifier.sanitize(html, INLINE_CONFIG);

/**
 * Removes scripts, event handlers, unsafe links and embedded media from an HTML string.
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
 * Removes everything from an svg element that is not plain SVG markup. Markup that is not a
 * complete svg element is wrapped into one.
 * @param markup A complete svg element or the content of one.
 * @param onElement Invoked for every kept element in document order, after its attributes were
 * sanitized, so callers can adjust it within the same pass.
 * @returns The sanitized svg element, or null when nothing is left.
 */
export const sanitizeSvgElement = (
  markup: string,
  onElement?: (element: Element) => void
): Element | null => {
  const withoutProlog = markup.replace(/^(\s*(<\?xml[^>]*>|<!--[\s\S]*?-->|<!DOCTYPE[^>[]*(\[[\s\S]*?\])?\s*>))*/i, '').trim();
  const svg = /^<svg[\s>]/i.test(withoutProlog) ? withoutProlog : `<svg>${withoutProlog}</svg>`;

  visitSvgElement = onElement ?? null;

  try {
    const body = svgElementPurifier.sanitize(svg, SVG_CONFIG) as HTMLElement;
    const root = body.firstElementChild;

    return root?.nodeName.toLowerCase() === 'svg' ? root : null;
  } finally {
    visitSvgElement = null;
  }
};

/**
 * Removes everything from the content of an SVG element that is not plain SVG markup.
 * @param content The content of the SVG element.
 * @returns The sanitized content.
 */
export const sanitizeSvg = memoize((content: string) => sanitizeSvgElement(`<svg>${content}</svg>`)?.innerHTML ?? '');
