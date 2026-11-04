import memoize from 'lodash/memoize';
import { sanitizeSvgElement } from '@shopgate/engage/components/SafeHtml/sanitize';
import type { ParseIconOptions, ParsedIcon } from '../types';
import { hashString } from './_internal/hash';
import {
  inlineStyleElements,
  normalizeElement,
  removeExternalReferences,
  unwrapLinks,
  type NormalizeContext,
} from './_internal/normalize';

const ROOT_ATTRIBUTES = [
  'fill', 'fill-rule', 'clip-rule', 'stroke', 'stroke-linecap', 'stroke-linejoin',
  'stroke-miterlimit',
];

const EMPTY_ICON: ParsedIcon = {
  attributes: {},
  content: '',
};

/**
 * Reads the viewBox of an svg element, or derives one from its width and height.
 * @param root The svg element.
 * @returns The viewBox, or undefined when the element has none.
 */
const readViewBox = (root: Element) => {
  const viewBox = root.getAttribute('viewBox');

  if (viewBox) {
    return viewBox.trim();
  }

  const [width, height] = ['width', 'height'].map((name) => {
    const value = root.getAttribute(name) ?? '';
    return value.includes('%') ? NaN : parseFloat(value);
  });

  return width > 0 && height > 0 ? `0 0 ${width} ${height}` : undefined;
};

/**
 * Reads the presentation attributes of an svg element, including those of its style attribute.
 * @param root The svg element.
 * @returns The attributes by name.
 */
const readRootAttributes = (root: Element) => {
  const style = (root.getAttribute('style') ?? '')
    .split(';')
    .map(declaration => declaration.split(':').map(part => part.trim()))
    .filter(([property, value]) => ROOT_ATTRIBUTES.includes(property) && value);

  return ROOT_ATTRIBUTES.reduce<Record<string, string>>((attributes, name) => {
    const value = style.find(([property]) => property === name)?.[1] ?? root.getAttribute(name);
    return value ? {
      ...attributes,
      [name]: value,
    } : attributes;
  }, {});
};

/**
 * Parses icon markup: sanitizes it, reads the svg element's own viewBox and presentation
 * attributes and normalizes colors, ids and stroke widths within the same pass. References to
 * other documents and links are removed in any case.
 * @param markup A complete svg element or the content of one.
 * @param options The parse options.
 * @returns The parsed icon.
 */
export const parseIconSvg = memoize((
  markup: string,
  { keepColors = false, normalize = true }: ParseIconOptions = {}
): ParsedIcon => {
  if (typeof markup !== 'string' || !markup.trim()) {
    return EMPTY_ICON;
  }

  const context: NormalizeContext = {
    keepColors,
    idPrefix: `sgi${hashString(`${Number(keepColors)}${markup}`)}-`,
    strokeWidths: [],
  };

  const root = sanitizeSvgElement(markup, (element) => {
    removeExternalReferences(element);

    if (normalize) {
      normalizeElement(element, context);
    }
  });

  if (!root) {
    return EMPTY_ICON;
  }

  unwrapLinks(root);

  if (normalize) {
    inlineStyleElements(root, context);
  }

  const strokeWidth = normalize
    ? context.strokeWidths[0]
    : parseFloat(root.getAttribute('stroke-width') ?? '');

  return {
    viewBox: readViewBox(root),
    attributes: readRootAttributes(root),
    content: root.innerHTML,
    strokeWidth: Number.isFinite(strokeWidth) ? strokeWidth : undefined,
  };
}, (markup, { keepColors = false, normalize = true } = {}) => `${Number(normalize)}${Number(keepColors)}${markup}`);
