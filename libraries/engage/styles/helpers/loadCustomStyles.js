import appConfig from '@shopgate/pwa-common/helpers/config';
import { initCSSCustomProps, initCSSCustomPropsFallback } from './initCSSCustomProperties';

/**
 * Loads external CSS with custom properties.
 * Resolves when styles are loaded and initialized.
 *
 * @deprecated The `customStyleUrl` setting was removed from the theme configs, so no stylesheet is
 * loaded anymore and the colors always come from the theme config. Only the fallback part of this
 * function is still needed, the stylesheet loading can be removed.
 *
 * @returns {Promise<void>}
 */
export const loadCustomStyles = () => new Promise((resolve) => {
  const id = 'external-css';
  const { customStyleUrl: href } = appConfig;
  let linkTag = document.querySelector(`#${id}`);

  /**
   * Initialize fallback custom properties when loading fails
   */
  const finishWithFallback = () => {
    initCSSCustomPropsFallback();
    resolve();
  };

  if (!href) {
    finishWithFallback();
    return;
  }

  // If already present
  if (linkTag) {
    // If already loaded
    if (linkTag.sheet) {
      initCSSCustomProps();
      resolve();
      return;
    }

    // If still loading
    linkTag.addEventListener('load', () => {
      initCSSCustomProps();
      resolve();
    });

    linkTag.addEventListener('error', finishWithFallback);
    return;
  }

  // Create link element
  linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.type = 'text/css';
  linkTag.href = href;
  linkTag.id = id;

  linkTag.onload = () => {
    initCSSCustomProps();
    resolve();
  };

  linkTag.onerror = finishWithFallback;

  document.head.appendChild(linkTag);
});
