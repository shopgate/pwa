const STYLE_TAG_ID = 'engage-global-styles';
const insertedRules = new Set();

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
