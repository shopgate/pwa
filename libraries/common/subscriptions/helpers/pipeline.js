import { i18n } from '@shopgate/engage/core/helpers';

/**
 * @param {Object} error error
 * @returns {string|*}
 */
export function transformGeneralPipelineError(error) {
  const { message } = error;

  const generalPipelineErrors = [
    'An internal error occured',
    'An internal error occurred',
    '502 Bad Gateway',
    'error from bigApi',
    'BigApi request',
    'error in bigApi',
  ];

  const general = new RegExp(`(${generalPipelineErrors.join('|')})`, 'i');
  if (general.test(message)) {
    return 'error.general';
  }
  return message;
}

/**
 * @typedef {Object} DisplayErrorMessage
 * @property {string} message The text to display — an already-translated string or a locale key.
 * @property {boolean} translated Whether `message` is ready-to-display text (`true`) or a locale
 *   key that still needs to go through I18n.Text (`false`).
 */

/**
 * Resolves the message to display for a pipeline error, without ever surfacing raw backend text.
 * Also reports whether the result is ready-to-display text or a locale key
 * Precedence:
 * 1. An extension's own message when it is explicitly flagged as already translated.
 * 2. A resolvable i18n key — safe to surface even when errorManager did not remap it, because a
 *    translation key (e.g. `cart.error_out_of_stock`) is not raw backend text. `i18n.has` confirms
 *    the key actually resolves in the loaded locales, rather than merely looking like a key.
 * 3. The code-mapped message. When errorManager maps the error code it resolves a message that
 *    differs from the raw backend text (`error.meta.message`).
 * 4. A generic, translated fallback otherwise — including when nothing mapped and errorManager fell
 *    back to the raw backend message (`error.message === error.meta.message`).
 * @param {Object} error The queued pipeline error.
 * @param {string} error.message The message resolved by errorManager (code-mapped or raw fallback).
 * @param {Object} [error.meta] The error meta data.
 * @param {boolean} [error.meta.translated] Whether the backend message is already translated.
 * @param {string} [error.meta.message] The original, raw backend message.
 * @param {string} genericMessage The generic fallback message key.
 * @returns {DisplayErrorMessage}
 */
export function getDisplayErrorMessage(error, genericMessage) {
  const { message, meta = {} } = error;
  const { translated, message: originalMessage } = meta;

  if (translated && originalMessage) {
    return {
      message: originalMessage,
      translated: true,
    };
  }

  // A translation key is never raw backend text, so surface it even when errorManager left it
  // untouched (`message === originalMessage`).
  if (typeof message === 'string' && i18n.has(message)) {
    return {
      message,
      translated: false,
    };
  }

  // Only trust `message` when we have the raw backend message to compare against and a mapping
  // actually replaced it. Without the raw message we cannot rule out that `message` is raw text.
  if (originalMessage !== undefined && message !== originalMessage) {
    return {
      message,
      translated: false,
    };
  }

  return {
    message: genericMessage,
    translated: false,
  };
}
