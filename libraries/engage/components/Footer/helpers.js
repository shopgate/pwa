import {
  logger,
  isDev,
} from '@shopgate/engage/core/helpers';
import { DATA_IGNORED } from './constants';

/**
 * Determines if an element is visually present in the DOM.
 * Checks for display, visibility, opacity, and transform-based hiding.
 *
 * @param {HTMLElement} el The element to evaluate.
 * @returns {boolean} True if the element is visually visible; false otherwise.
 */
export const isElementVisible = (el) => {
  if (!el || !(el instanceof HTMLElement)) return false;

  const style = window.getComputedStyle(el);

  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    parseFloat(style.opacity) === 0
  ) return false;

  const { transform } = style;

  if (transform && transform !== 'none') {
    const match = transform.match(/translateY\((-?\d+)(px)?\)/);
    if (match) {
      const translateY = parseInt(match[1], 10);
      if (translateY > window.innerHeight) return false;
    }
  }

  return true;
};

/**
 * Finds the widest nested element inside a given container that has a background color
 * explicitly set via CSS (ignores transparent, inherited, or unset values), and returns
 * that background color.
 *
 * @param {HTMLElement} container The parent element to search within. Must be an actual DOM node.
 * @returns {string|null} The detected background color (e.g., "rgb(255, 0, 0)")
 */
export const getElementBackgroundColor = (container) => {
  if (!container) {
    return null;
  }

  let widestElement = null;
  let maxWidth = -Infinity;

  /**
   * Recursively traverses the DOM tree starting from the given node,
   * tracking the widest element that has a background color explicitly set via CSS.
   *
   * @param {HTMLElement} node The DOM node to begin traversal from.
   */
  function walk(node) {
    if (!(node instanceof HTMLElement)) return;

    const style = window.getComputedStyle(node);
    const bgColor = style.backgroundColor;

    const isStyledColor = bgColor && ![
      'transparent',
      'rgba(0, 0, 0, 0)',
      'inherit',
      'initial',
      'unset',
    ].includes(bgColor);

    const rect = node.getBoundingClientRect();
    if (isElementVisible(node) && isStyledColor && rect.width > maxWidth) {
      maxWidth = rect.width;
      widestElement = node;
    }

    Array.from(node.children).forEach(walk);
  }

  walk(container);

  if (widestElement) {
    const result = window.getComputedStyle(widestElement).backgroundColor;
    return result;
  }

  return null;
};

/**
 * Checks if any of the provided class names reference the custom property in any loaded stylesheet.
 *
 * @param {string[]} classList Array of class names to check.
 * @param {string} customProp The custom property to search for in the stylesheets.
 * @returns {boolean} True if any class rule uses the custom property.
 */
const classNamesUseCustomProp = (classList, customProp) => {
  const allRules = Array.from(document.styleSheets)
    .filter((sheet) => {
      try {
        return sheet.cssRules;
      } catch (e) {
        return false; // Skip cross-origin or restricted stylesheets
      }
    })
    .flatMap(sheet => Array.from(sheet.cssRules || []));

  // eslint-disable-next-line no-restricted-syntax
  for (const rule of allRules) {
    // eslint-disable-next-line no-continue
    if (!rule.selectorText || !rule.cssText.includes(`var(${customProp})`)) continue;

    // eslint-disable-next-line no-restricted-syntax
    for (const className of classList) {
      if (rule.selectorText.includes(`.${className}`)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if a single element uses the custom property via inline styles or class-based rules.
 *
 * @param {HTMLElement} el The element to check.
 * @param {string} customProp The CSS custom property to search for.
 * @returns {boolean} True if the element uses the custom property.
 */
const elementUsesCustomProp = (el, customProp) => {
  if (!(el instanceof Element)) return false;

  const styleAttr = el.getAttribute?.('style');

  if (styleAttr && styleAttr.includes(`var(${customProp})`)) {
    return true;
  }

  const classList = Array.from(el.classList || []);
  return classList.length > 0 && classNamesUseCustomProp(classList, customProp);
};

/**
 * Checks if an element or any of its descendants use the custom property.
 *
 * @param {HTMLElement} el The root element to inspect.
 * @param {string} customProp The CSS custom property to look for.
 * @returns {boolean} True if the element or any descendant uses the custom property.
 */
const elementOrDescendantsUseCustomProp = (el, customProp) => {
  // Check if the element itself uses the custom property
  if (elementUsesCustomProp(el, customProp)) return true;

  const descendants = el.querySelectorAll('*');

  // eslint-disable-next-line no-restricted-syntax
  for (const node of descendants) {
    // eslint-disable-next-line no-continue
    if (!(node instanceof Element)) continue;
    if (elementUsesCustomProp(node, customProp)) return true;
  }

  return false;
};

/**
 * Returns footer entries that do NOT have safe area insets applied,
 * either on themselves or in any of their descendants.
 *
 * @param {HTMLElement[]} footerElements The footer elements to check.
 * @returns {HTMLElement[]} An array of direct children that do not use safe area insets.
 */
const getFooterEntriesWithoutSafeAreaInsets = footerElements => footerElements.filter(
  child => !elementOrDescendantsUseCustomProp(child, '--safe-area-inset-bottom')
);

/**
 * Searches for footer elements that do not have safe area insets applied, and adds a fallback.
 * @param {HTMLElement} footerEl The footer element whose children are to be checked.
 */
export const handleSafeAreaInsets = (footerEl) => {
  if (!footerEl || !(footerEl instanceof HTMLElement)) {
    return;
  }

  const directChildren = Array.from(footerEl.children);

  // Filter out elements that where already handled before
  const childrenToInspect = directChildren
    .filter(child => child.getAttribute('data-has-safe-area-inset') !== 'true')
    .filter(child => child.getAttribute(DATA_IGNORED) !== 'true');

  // Detect footer elements without safe area insets
  const childrenWithoutInsets = getFooterEntriesWithoutSafeAreaInsets(childrenToInspect);

  // Apply fallback and mark the elements as handled
  childrenWithoutInsets.forEach((child) => {
    child.style.setProperty('padding-bottom', 'var(--safe-area-inset-bottom)');
    child.style.setProperty('background-color', getElementBackgroundColor(child));
    child.setAttribute('data-has-safe-area-inset', 'true');
  });

  if (isDev && childrenWithoutInsets.length > 0) {
    logger.warn(
      'Footer elements without safe area insets detected. Please use the "--safe-area-inset-bottom" CSS custom property for bottom insets.',
      childrenWithoutInsets
    );
  }

  // Mark all other elements which already had insets as handled
  directChildren.filter(child => childrenWithoutInsets.indexOf(child) === -1).forEach((child) => {
    if (!child.hasAttribute('data-has-safe-area-inset')) {
      child.setAttribute('data-has-safe-area-inset', 'true');
    }
  });
};

const { style } = document.documentElement;

/**
 * Update the footer height custom property
 * @param {number} height height
 */
export const updateFooterHeight = (height) => {
  // The TabBar uses position: fixed, so its height will be ignored when height of the Footer is
  // measured. Additionally it's animated in some cases which makes measuring via JS much more
  // complicated.
  // To simplify everything, we just use the --tabbar-height CSS custom property insider the
  // --footer-height CSS custom property. This will be 0px when the tabbar is not visible.
  const footerHeight = `max(${height}px, var(--tabbar-height, 0px))`;

  if (style.getPropertyValue('--footer-height') !== footerHeight) {
    style.setProperty('--footer-height', footerHeight);
  }
};
