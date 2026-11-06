/**
 * Readable `block__element` classes that the components keep stable across releases, so merchants
 * can target them with custom css, e.g. `engage__product-card` or `push-opt-in-modal__title`.
 * Generated `sg-*` and MUI classes never contain `__`, and change with every build or library
 * update, so they are never offered.
 */
const STABLE_CLASS = /^(?!sg-)[a-z][a-z0-9-]*__[\w-]+$/;

/**
 * Unprefixed classes from before the naming scheme, documented by the content styling extension.
 */
const LEGACY_CLASSES = new Set([
  'headline',
  'price',
  'price-striked',
  'product-name',
  'rating-stars-empty',
  'rating-stars-filled',
  'loading-indicator',
]);

const MAX_SELECTORS = 6;

/**
 * Returns the stable class of an element, preferring the prefixed ones.
 * @param element The element to check.
 * @returns The class, or null when the element has none.
 */
export const getStableClass = (element: Element): string | null => {
  const classes = Array.from(element.classList);

  return classes.find(name => STABLE_CLASS.test(name))
    ?? classes.find(name => LEGACY_CLASSES.has(name))
    ?? null;
};

/**
 * Finds the element itself or its closest ancestor that has a stable class.
 * @param element The element under the pointer.
 * @returns The element to pick, or null when no ancestor has a stable class.
 */
export const findStableElement = (element: Element | null): Element | null => {
  let current = element;

  while (current) {
    if (getStableClass(current)) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
};

/**
 * Escapes a value for a quoted CSS string, e.g. a product property label with quotes.
 * @param value The attribute value.
 * @returns The value with quotes, backslashes and line breaks escaped.
 */
const escapeCssString = (value: string) => value
  .replace(/["\\]/g, '\\$&')
  .replace(/\r\n|[\n\r\f]/g, '\\a ');

/**
 * Builds selectors that narrow the stable class of an element down to one of its variants, e.g.
 * `.engage__product-tile-actions[data-position="topRight"]`. Test ids are left out. Flags, which
 * components write as an empty value or `"true"`, become presence selectors like `[data-selected]`.
 * @param element The element to check.
 * @returns One selector per data attribute, or none when the element has no stable class.
 */
export const getDataAttributeSelectors = (element: Element): string[] => {
  const stableClass = getStableClass(element);

  if (!stableClass) {
    return [];
  }

  return Array.from(element.attributes)
    .filter(({ name }) => name.startsWith('data-') && !name.startsWith('data-test'))
    .map(({ name, value }) => (
      value === '' || value === 'true'
        ? `.${stableClass}[${name}]`
        : `.${stableClass}[${name}="${escapeCssString(value)}"]`
    ));
};

/**
 * Collects the selectors of a picked element and its ancestors with stable classes, from the
 * element outwards, so a merchant can pick how broad a rule should be. The variants of the picked
 * element follow its own class selector.
 * @param element The picked element.
 * @returns Selectors like `.engage__product-card`.
 */
export const getStableSelectors = (element: Element): string[] => {
  const selectors: string[] = [];
  let current: Element | null = element;

  while (current && selectors.length < MAX_SELECTORS) {
    const stableClass = getStableClass(current);
    const selector = stableClass ? `.${stableClass}` : null;

    if (selector && !selectors.includes(selector)) {
      selectors.push(selector);
    }

    current = current.parentElement;
  }

  selectors.splice(1, 0, ...getDataAttributeSelectors(element));

  return selectors;
};
