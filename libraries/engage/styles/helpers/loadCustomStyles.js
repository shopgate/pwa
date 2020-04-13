import appConfig from '@shopgate/pwa-common/helpers/config';
import { isDev } from '@shopgate/engage/core';
import { initCSSCustomProps, initCSSCustomPropsFallback } from './initCSSCustomProperties';

/**
 * Loads external CSS with custom properties
 * @returns {void}
 */
export const loadCustomStyles = () => {
  const id = 'external-css';
  const { customStyleUrl: href } = appConfig;
  let linkTag = document.querySelector(`#${id}`);

  /**
   * Error handler
   */
  const onError = () => {
    if (isDev) {
      initCSSCustomPropsFallback();
    }
  };

  if (!href) {
    onError();
  }

  if (href && !linkTag) {
    linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    linkTag.setAttribute('href', href);
    linkTag.setAttribute('id', id);
    linkTag.onload = initCSSCustomProps;
    linkTag.onerror = onError;
    document.querySelector('head').appendChild(linkTag);
  }
};
