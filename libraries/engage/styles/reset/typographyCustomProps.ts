/**
 * CSS custom property names for the root (base) typography. Internal to the styles layer: the css
 * reset publishes the build-time defaults as these properties on `<html>` and consumes them
 * (`html { font-*: var(--sg-root-*) }`), and the theme references `--sg-root-font-family`. They are
 * an optional override layer: a higher-specificity `:root` rule (admin css file / live preview / an
 * extension) overrides the shipped default.
 *
 * Not re-exported from the styles barrel - import from this module directly where needed.
 */
export const CSS_ROOT_FONT_FAMILY = '--sg-root-font-family';
export const CSS_ROOT_FONT_SIZE = '--sg-root-font-size';
export const CSS_ROOT_LINE_HEIGHT = '--sg-root-line-height';
