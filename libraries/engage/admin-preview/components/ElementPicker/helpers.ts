/**
 * Readable classes that the components keep stable across releases, so merchants can target them
 * with custom css. Generated `sg-*` classes change with every build and are never offered.
 */
const STABLE_CLASS = /^(engage|theme|ui-shared|ui-material|ui-ios|common|widget)__[\w-]+$/;

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
 * Collects the selectors of a picked element and its ancestors with stable classes, from the
 * element outwards, so a merchant can pick how broad a rule should be.
 * @param element The picked element.
 * @returns Class selectors like `.engage__product-card`.
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

  return selectors;
};
