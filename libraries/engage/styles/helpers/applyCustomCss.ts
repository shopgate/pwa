export const CUSTOM_CSS_STYLE_TAG_ID = 'custom-css';

const INSERTION_POINT_SELECTOR = 'meta[name="custom-css-insertion-point"]';

/**
 * Writes the merchant's custom css into a style tag at the custom css insertion point, which the
 * html template declares after all other style layers. An empty stylesheet removes the tag.
 * @param css The stylesheet.
 */
export const applyCustomCss = (css: string) => {
  let styleTag = document.querySelector<HTMLStyleElement>(`#${CUSTOM_CSS_STYLE_TAG_ID}`);

  if (!css) {
    styleTag?.remove();
    return;
  }

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = CUSTOM_CSS_STYLE_TAG_ID;

    const insertionPoint = document.querySelector(INSERTION_POINT_SELECTOR);

    if (insertionPoint) {
      insertionPoint.parentNode?.insertBefore(styleTag, insertionPoint.nextSibling);
    } else {
      document.head.appendChild(styleTag);
    }
  }

  styleTag.textContent = css;
};
