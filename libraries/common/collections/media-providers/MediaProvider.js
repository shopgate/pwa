import { i18n, logger } from '@shopgate/engage/core/helpers';
import { PRIVACY_SETTINGS_PATTERN } from '@shopgate/engage/tracking/constants';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { isRelativePosition, isAbsolutePosition } from '../../helpers/dom';

import './MediaProvider.css';

const { colors } = themeConfig;

/** @type {string} Stable class name (plain CSS, not CSS-in-JS). */
export const mediaProviderResponsiveContainerClass = 'common__media-provider_responsive-container';

/**
 * @returns {string} Cookie consent SVG markup (fill from theme).
 */
function consentMessageIconHtml() {
  const fill = colors.shade5;
  return `
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 110 84"
    version="1.1"
    class="common__media-provider_cookie-consent-icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="${fill}" transform="matrix(1,0,0,1,-24.6099,-41.8178)">
      <path d="M50.303,68.639L104.088,98.668L56.288,125.172C55.039,125.865 53.518,125.845 52.288,125.12C51.058,124.396 50.303,123.075 50.303,121.648L50.303,68.639ZM50.303,54.702L50.303,45.855C50.303,44.425 51.059,43.102 52.292,42.376C53.524,41.651 55.048,41.631 56.298,42.324C71.141,50.554 109.492,71.82 124.676,80.239C125.95,80.945 126.741,82.288 126.741,83.745C126.741,85.203 125.95,86.545 124.676,87.252L116.612,91.724L50.303,54.702Z" />
      <g transform="matrix(0.944597,0.527391,-0.487489,0.873129,45.7069,-42.8282)">
        <path d="M139,89C139,87.344 137.757,86 136.227,86L26.773,86C25.243,86 24,87.344 24,89C24,90.656 25.243,92 26.773,92L136.227,92C137.757,92 139,90.656 139,89Z" />
      </g>
    </g>
  </svg>`;
}

/**
 * Base media provider (DOM helpers for embedded video).
 */
export default class MediaProvider {
  /**
   * @param {Object} [options] Provider options.
   * @param {boolean} [options.responsify=true] Whether to responsify video containers.
   */
  constructor(options = {}) {
    this.containers = new Map();
    this.isPending = false;
    this.remoteScriptUrl = null;
    this.options = {
      responsify: options.responsify ?? true,
    };
  }

  /**
   * Called when the external player script has finished loading. Override in subclasses.
   * @returns {void}
   */
  onScriptLoaded() { // eslint-disable-line class-methods-use-this
    logger.error('MediaProvider.onScriptLoaded() needs to be implemented within an inheriting class');
  }

  /**
   * Returns embedded media elements within a container. Override in subclasses.
   * @returns {void}
   */
  getMediaContainers() { // eslint-disable-line class-methods-use-this
    logger.error('MediaProvider.getMediaContainers() needs to be implemented within an inheriting class');
  }

  /**
   * Optional iframe optimizations for a document. Override in subclasses.
   * @returns {MediaProvider}
   */
  applyIframeOptimizations() {
    return this;
  }

  /**
   * Optimizes video container to make it responsive.
   * @param {Element} container A DOM container.
   * @returns {MediaProvider}
   */
  responsify(container) {
    if (!this.options.responsify) {
      return this;
    }
    // Remove fixed dimensions from the container.
    container.removeAttribute('height');
    container.removeAttribute('width');

    if (isRelativePosition(container.parentNode)
      && isAbsolutePosition(container)) {
      // Assume responsive embed code
      container.parentNode.removeAttribute('style');
    }

    // Create the wrapper and apply styling.
    const wrapper = document.createElement('div');
    wrapper.className = mediaProviderResponsiveContainerClass;
    // Add the wrapper right before the container into the DOM.
    container.parentNode.insertBefore(wrapper, container);
    // Move the container into the wrapper.
    wrapper.appendChild(container);

    return this;
  }

  /**
   * Searches for embedded media and replaces it with a placeholder element when comfort cookie
   * consent is not accepted.
   * Should be called before media container / markup is mounted to the DOM.
   * @param {ParentNode} container A DOM container.
   * @param {Object} [cookieConsentSettings] Cookie consent settings.
   * @returns {MediaProvider}
   */
  handleCookieConsent(container, cookieConsentSettings = {}) {
    const iframes = this.getMediaContainers(container);

    if (!iframes.length || cookieConsentSettings.comfortCookiesAccepted !== false) {
      return this;
    }

    iframes.forEach((iframe) => {
      this.responsify(iframe);
      const responsiveContainer = iframe.parentNode;
      responsiveContainer.textContent = null;
      this.injectCookieConsentMessage(responsiveContainer);
    });

    return this;
  }

  /**
   * @param {Element} container A DOM container.
   * @returns {MediaProvider}
   */
  injectCookieConsentMessage(container) {
    // Create the message wrapper element and add styling.
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add(
      'common__media-provider_cookie-consent-message-container'
    );
    messageWrapper.style.background = colors.shade10;
    messageWrapper.style.border = `1px solid ${colors.shade5}`;
    messageWrapper.style.borderRadius = '4px';
    messageWrapper.innerHTML = consentMessageIconHtml();

    // Create the message element and add styling.
    const message = document.createElement('span');
    message.classList.add('common__media-provider_cookie-consent-message-container_message');
    message.innerHTML = i18n.text('htmlSanitizer.videoCookieConsent.message');
    messageWrapper.appendChild(message);

    // Create the link element and add styling.
    const link = document.createElement('a');
    link.classList.add(
      'common__media-provider_cookie-consent-message-container_link'
    );
    link.style.textAlign = 'center';
    link.style.color = colors.primary;
    link.style.fontWeight = '500';
    link.href = `${PRIVACY_SETTINGS_PATTERN}?source=video`;
    link.innerHTML = i18n.text('htmlSanitizer.videoCookieConsent.link');
    messageWrapper.appendChild(link);

    // Add the message wrapper to the container.
    container.appendChild(messageWrapper);

    return this;
  }

  /**
   * Registers a DOM container with embedded videos. Override in subclasses.
   * @returns {MediaProvider}
   */
  add() {
    logger.error('MediaProvider.add() needs to be implemented within an inheriting class');
    return this;
  }

  /**
   * Removes a DOM container with embedded videos.
   * @param {NodeList} container A DOM container.
   * @returns {MediaProvider}
   */
  remove(container) {
    this.containers.delete(container);
    return this;
  }

  /**
   * Stops playback for registered media. Override in subclasses.
   * @returns {MediaProvider}
   */
  stop() {
    logger.error('MediaProvider.stop() needs to be implemented within an inheriting class');
    return this;
  }
}
