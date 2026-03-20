const STYLE_TAG_ID = 'engage-global-styles';
const insertedRules = new Set();

/**
 * Converts camelCase to kebab-case.
 * @param {string} value The style property name.
 * @returns {string}
 */
const toKebabCase = value => value.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

/**
 * Returns (or creates) the singleton style tag for global styles.
 * @returns {HTMLStyleElement|null}
 */
const getStyleTag = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  let styleTag = document.getElementById(STYLE_TAG_ID);
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = STYLE_TAG_ID;
    document.head.appendChild(styleTag);
  }

  return styleTag;
};

/**
 * Serializes a style object into CSS declarations.
 * @param {Object} styles The style object.
 * @returns {string}
 */
const toCssDeclarations = styles => Object.entries(styles)
  .map(([property, value]) => `${toKebabCase(property)}:${value};`)
  .join('');

/**
 * Inserts a global selector rule once.
 * @param {string} selector The CSS selector.
 * @param {Object} styles The style declarations.
 */
export const insertGlobalRule = (selector, styles) => {
  const key = `rule:${selector}:${JSON.stringify(styles)}`;
  if (insertedRules.has(key)) {
    return;
  }

  const styleTag = getStyleTag();
  if (!styleTag) {
    return;
  }

  styleTag.appendChild(document.createTextNode(`${selector}{${toCssDeclarations(styles)}}`));
  insertedRules.add(key);
};

/**
 * Inserts raw CSS once.
 * @param {string} cssText The raw CSS text.
 */
export const insertGlobalRaw = (cssText) => {
  const key = `raw:${cssText}`;
  if (insertedRules.has(key)) {
    return;
  }

  const styleTag = getStyleTag();
  if (!styleTag) {
    return;
  }

  styleTag.appendChild(document.createTextNode(cssText));
  insertedRules.add(key);
};
