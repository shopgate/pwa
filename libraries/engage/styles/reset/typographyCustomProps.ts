/**
 * CSS custom property names for the shared base typography. Internal to the styles layer: the css
 * reset publishes them on `<html>` — `--sg-root-font-family` is the shared family used by every
 * typography variant, `--sg-root-font-size` is the rem anchor. They're an optional override layer: a
 * higher-specificity `:root` rule (admin css file / live preview / an extension) overrides the
 * shipped default. The base body text itself is the `body1` variant, applied to `<body>` by the reset.
 *
 * Not re-exported from the styles barrel - import from this module directly where needed.
 */
export const CSS_ROOT_FONT_FAMILY = '--sg-root-font-family';
export const CSS_ROOT_FONT_SIZE = '--sg-root-font-size';
