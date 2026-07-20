import { i18n } from '@shopgate/engage/core/helpers';

/**
 * Matches i18n keys (dot-separated identifiers), e.g. "ApiteSW6Utility.cart.summaryShipping".
 * Plain literal labels (containing spaces, punctuation, a single word, etc.) never match.
 */
const I18N_KEY_PATTERN = /^(\w+\.)+\w+$/;

/**
 * Picks a safe label for a cart total line.
 *
 * Backend cart totals may carry i18n keys (e.g. "ApiteSW6Utility.cart.summaryShipping") whose
 * translations are deployed separately from the app (via the shopware cart extension).
 * When such a key is not present in the frontend locale it would be rendered verbatim in the UI,
 * so we fall back to a known frontend key instead.
 * Labels that already resolve, and plain literal labels, are kept.
 *
 * @param {string} [label] The label supplied by the backend total.
 * @param {string} fallbackKey The frontend i18n key to use when the label is missing or is an
 *   unresolved i18n key.
 * @returns {string}
 */
export function getTotalLabel(label, fallbackKey) {
  if (!label) {
    return fallbackKey;
  }

  // Only i18n keys are checked for resolvability. i18n.text() echoes the key back when it has no
  // matching translation, which is how we detect an unresolved backend key.
  if (I18N_KEY_PATTERN.test(label) && i18n.text(label) === label) {
    return fallbackKey;
  }

  return label;
}
