import type { CSSDeclarationValue, FrontendSettingsStyling } from './types';

export const PREVIEW_STYLE_TAG_ID = 'frontend-settings-preview-overrides';

const INSERTION_POINT_SELECTOR = 'meta[name="preview-css-insertion-point"]';

const UNITLESS_PROPERTIES = new Set([
  'font-weight',
  'line-height',
  'opacity',
  'z-index',
  'flex',
  'flex-grow',
  'flex-shrink',
  'order',
]);

const toKebabCase = (property: string) => property.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`);

const stringifyValue = (property: string, value: CSSDeclarationValue) => {
  if (typeof value === 'string') return value;
  if (value === 0) return '0';
  if (property.startsWith('--') || UNITLESS_PROPERTIES.has(property)) return `${value}`;

  return `${value}px`;
};

/**
 * Converts selector/declaration maps from the preview payload into a CSS string.
 *
 * @param styling Selector-to-declarations map received from the admin preview.
 * @returns Serialized CSS that can be assigned to a style tag.
 */
export const serializeStyling = (styling: FrontendSettingsStyling) => Object.entries(styling)
  .map(([selector, declarations]) => {
    const declarationString = Object.entries(declarations)
      .map(([propertyName, value]) => {
        const cssProperty = propertyName.startsWith('--')
          ? propertyName
          : toKebabCase(propertyName);

        return `${cssProperty}: ${stringifyValue(cssProperty, value)};`;
      })
      .join(' ');

    if (!declarationString) return '';

    return `${selector} { ${declarationString} }`;
  })
  .filter(Boolean)
  .join('\n');

/**
 * Returns the existing preview style tag or creates it at the preview css insertion point, which
 * the html template declares directly below the theme css one. The preview has to override both
 * the defaults that theme initialization generates and the theme css file, and since all three
 * have the same specificity, only document order decides.
 *
 * Falls back to appending when the meta is absent, which is where the tag used to live before the
 * insertion points existed.
 *
 * @returns The style element used for frontend settings preview overrides.
 */
export const getOrCreateStyleTag = () => {
  let styleTag = document.querySelector<HTMLStyleElement>(`#${PREVIEW_STYLE_TAG_ID}`);

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('id', PREVIEW_STYLE_TAG_ID);
    styleTag.setAttribute('type', 'text/css');

    const insertionPoint = document.querySelector(INSERTION_POINT_SELECTOR);

    if (insertionPoint) {
      insertionPoint.parentNode?.insertBefore(styleTag, insertionPoint.nextSibling);
    } else {
      document.head.appendChild(styleTag);
    }
  }

  return styleTag;
};

/**
 * Removes the preview override style tag from the document head if it exists.
 */
export const removeStyleTag = () => {
  const styleTag = document.querySelector(`#${PREVIEW_STYLE_TAG_ID}`);
  styleTag?.remove();
};
