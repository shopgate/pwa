const COLOR_PROPERTIES = ['fill', 'stroke', 'stop-color'];

const KEPT_COLOR_VALUE = /^\s*(none|currentcolor|transparent|inherit|url\()/i;

const REFERENCE_ATTRIBUTES = ['href', 'xlink:href'];

const INLINED_PROPERTIES = [
  'clip-path', 'clip-rule', 'display', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'mask',
  'opacity', 'stop-color', 'stop-opacity', 'stroke', 'stroke-dasharray', 'stroke-linecap',
  'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'visibility',
];

const SIMPLE_CLASS_SELECTOR = /^\.[\w-]+$/;

const EXTERNAL_URL = /url\(\s*['"]?(?!#)/i;

/**
 * The state of one normalization pass.
 */
export interface NormalizeContext {
  /**
   * Keeps the colors of the markup.
   */
  keepColors: boolean;
  /**
   * Prefix for the ids of the markup, unique per icon.
   */
  idPrefix: string;
  /**
   * The stroke widths that were removed from the markup, in document order.
   */
  strokeWidths: number[];
}

/**
 * Parses the declarations of a style attribute or rule.
 * @param style The declarations.
 * @returns The declarations as property value pairs.
 */
const parseDeclarations = (style: string) => style
  .split(';')
  .map((declaration) => {
    const separator = declaration.indexOf(':');
    return [
      declaration.slice(0, separator).trim().toLowerCase(),
      declaration.slice(separator + 1).trim(),
    ];
  })
  .filter(([property, value]) => property && value);

/**
 * Prefixes the local references of a value with the id prefix.
 * @param value The value.
 * @param context The normalization context.
 * @returns The value with prefixed references.
 */
const prefixReferences = (value: string, context: NormalizeContext) => value
  .replace(/url\(\s*(['"]?)#/g, `url($1#${context.idPrefix}`);

/**
 * Normalizes a single property value. Returns null for values that are removed.
 * @param property The property name.
 * @param value The value.
 * @param context The normalization context.
 * @returns The normalized value, or null when the property is removed.
 */
const normalizeValue = (property: string, value: string, context: NormalizeContext) => {
  if (property === 'stroke-width') {
    const width = parseFloat(value);

    if (!Number.isNaN(width)) {
      context.strokeWidths.push(width);
    }

    return null;
  }

  if (!context.keepColors && COLOR_PROPERTIES.includes(property) && !KEPT_COLOR_VALUE.test(value)) {
    return 'currentColor';
  }

  return prefixReferences(value, context);
};

/**
 * Normalizes an element of icon markup: colors follow the text color, ids get a per icon prefix
 * and stroke widths are removed, so the stroke width token can apply.
 * @param element The element.
 * @param context The normalization context.
 */
export const normalizeElement = (element: Element, context: NormalizeContext) => {
  if (element.id) {
    element.setAttribute('id', `${context.idPrefix}${element.id}`);
  }

  Array.from(element.attributes).forEach(({ name, value }) => {
    if (REFERENCE_ATTRIBUTES.includes(name)) {
      if (value.startsWith('#')) {
        element.setAttribute(name, `#${context.idPrefix}${value.slice(1)}`);
      }
      return;
    }

    if (name === 'style') {
      const style = parseDeclarations(value)
        .map(([property, declared]) => [property, normalizeValue(property, declared, context)])
        .filter(([, normalized]) => normalized !== null)
        .map(([property, normalized]) => `${property}:${normalized}`)
        .join(';');

      if (style) {
        element.setAttribute('style', style);
      } else {
        element.removeAttribute('style');
      }
      return;
    }

    if (name === 'id') {
      return;
    }

    const normalized = normalizeValue(name, value, context);

    if (normalized === null) {
      element.removeAttribute(name);
    } else if (normalized !== value) {
      element.setAttribute(name, normalized);
    }
  });
};

/**
 * Removes references to other documents from an element of icon markup, so an icon can't load
 * remote content. Local references to an id stay, and images keep embedded data.
 * @param element The element.
 */
export const removeExternalReferences = (element: Element) => {
  REFERENCE_ATTRIBUTES.forEach((name) => {
    const value = element.getAttribute(name)?.trim();

    if (value === undefined || value.startsWith('#')) {
      return;
    }

    if (element.nodeName.toLowerCase() === 'image' && /^data:image\//i.test(value)) {
      return;
    }

    element.removeAttribute(name);
  });
};

/**
 * Replaces the link elements of icon markup with their children, so an icon can't navigate.
 * @param root The svg element.
 */
export const unwrapLinks = (root: Element) => {
  Array.from(root.querySelectorAll('a')).forEach((link) => {
    link.replaceWith(...Array.from(link.childNodes));
  });
};

/**
 * Applies the simple class rules of `<style>` elements as attributes and removes the elements.
 * Inline svg styles apply to the whole page, so they must not stay in the markup.
 * @param root The svg element.
 * @param context The normalization context.
 */
export const inlineStyleElements = (root: Element, context: NormalizeContext) => {
  const styleElements = Array.from(root.querySelectorAll('style'));

  styleElements.forEach((styleElement) => {
    const css = (styleElement.textContent ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
    const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
    const rules: Array<[string, string]> = [];
    let match = rulePattern.exec(css);

    while (match) {
      rules.push([match[1], match[2]]);
      match = rulePattern.exec(css);
    }

    rules.forEach(([selectorList, body]) => {
      const declarations = parseDeclarations(body)
        .filter(([property, value]) => (
          INLINED_PROPERTIES.includes(property) && !EXTERNAL_URL.test(value)
        ));

      selectorList
        .split(',')
        .map(selector => selector.trim())
        .filter(selector => SIMPLE_CLASS_SELECTOR.test(selector))
        .forEach((selector) => {
          root.querySelectorAll(selector).forEach((element) => {
            declarations.forEach(([property, value]) => {
              const normalized = normalizeValue(property, value, context);

              if (normalized !== null) {
                element.setAttribute(property, normalized);
              }
            });
          });
        });
    });

    styleElement.remove();
  });
};
