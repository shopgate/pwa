import { i18n, logger } from '@shopgate/engage/core/helpers';
import { PRIVACY_SETTINGS_PATTERN } from '@shopgate/engage/tracking/constants';
import { isRelativePosition, isAbsolutePosition } from '../../helpers/dom';
import styles from './style';

const consentMessageIcon = `
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 110 84"
    version="1.1"
    class="${styles.consentIcon}"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(1,0,0,1,-24.6099,-41.8178)">
      <path d="M50.303,68.639L104.088,98.668L56.288,125.172C55.039,125.865 53.518,125.845 52.288,125.12C51.058,124.396 50.303,123.075 50.303,121.648L50.303,68.639ZM50.303,54.702L50.303,45.855C50.303,44.425 51.059,43.102 52.292,42.376C53.524,41.651 55.048,41.631 56.298,42.324C71.141,50.554 109.492,71.82 124.676,80.239C125.95,80.945 126.741,82.288 126.741,83.745C126.741,85.203 125.95,86.545 124.676,87.252L116.612,91.724L50.303,54.702Z" />
      <g transform="matrix(0.944597,0.527391,-0.487489,0.873129,45.7069,-42.8282)">
        <path d="M139,89C139,87.344 137.757,86 136.227,86L26.773,86C25.243,86 24,87.344 24,89C24,90.656 25.243,92 26.773,92L136.227,92C137.757,92 139,90.656 139,89Z" />
      </g>
    </g>
  </svg>`;

/* eslint-disable class-methods-use-this */

/**
 * The MediaProvider base class.
 */
class MediaProvider {
  /**
   * Constructor.
   */
  constructor() {
    this.containers = new Map();
    this.isPending = false;
    this.remoteScriptUrl = null;
  }

  /**
   * Callback for when Provider script is loaded
   * @callback
   * @abstract
   */
  onScriptLoaded() {
    logger.error('MediaProvider.onScriptLoaded() needs to be implemented within an inheriting class');
  }

  /**
   * Callback to retrieve a list of media containers
   * @callback
   * @abstract
   */
  getMediaContainers() {
    logger.error('MediaProvider.getMediaContainers() needs to be implemented within an inheriting class');
  }

  /**
   * Optimizes video container to make it responsive.
   * @param {Element} container A DOM container.
   * @returns {MediaProvider}
   */
  responsify(container) {
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

    wrapper.className = styles.responsiveContainer;

    // Add the wrapper right before the container into the DOM.
    container.parentNode.insertBefore(wrapper, container);
    // Move the container into the wrapper.
    wrapper.appendChild(container);

    return this;
  }

  /**
   * Searches for embedded media and replaces it with a placeholder element when comfort cookie
   * consent is not accepted.
   * @param {ParentNode} container A DOM container.
   * @param {Object} [cookieConsentSettings] Additional settings related to cookie consent.
   * @param {boolean} [cookieConsentSettings.comfortCookiesAccepted] Whether comfort cookies
   * are accepted.
   * @param {boolean} [cookieConsentSettings.statisticsCookiesAccepted] Whether statistics cookies.
   * @returns {MediaProvider}
   */
  handleCookieConsent(container, cookieConsentSettings = {}) {
    const iframes = this.getMediaContainers(container);

    if (!iframes.length || cookieConsentSettings.comfortCookiesAccepted !== false) {
      return this;
    }

    iframes.forEach((iframe) => {
      // Add responsive container around YouTube iframes
      this.responsify(iframe);
      // Select the container and clear its content
      const responsiveContainer = iframe.parentNode;
      responsiveContainer.textContent = null;
      // Add the consent message element to the container
      this.injectCookieConsentMessage(responsiveContainer);
    });

    return this;
  }

  /**
   * Injects a cookie consent message element into a container
   * @param {Element} container A DOM container.
   * @returns {MediaProvider}
   */
  injectCookieConsentMessage(container) {
    // Create the wrapper for the message element
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add(styles.consentContainer);

    // Add an SVG icon (implemented this way, since there where issues with document.createElement)
    messageWrapper.innerHTML = consentMessageIcon;

    // Create the main message and add it to the wrapper
    const message = document.createElement('span');
    message.innerText = i18n.text('htmlSanitizer.videoCookieConsent.message');
    messageWrapper.appendChild(message);

    // Create the link and add it to the wrapper
    const link = document.createElement('a');
    link.classList.add(styles.consentLink);
    link.href = PRIVACY_SETTINGS_PATTERN;
    link.innerText = i18n.text('htmlSanitizer.videoCookieConsent.link');
    messageWrapper.appendChild(link);

    // Add the wrapper to the container
    container.appendChild(messageWrapper);

    return this;
  }

  /**
   * Add a DOM container with embedded videos.
   * @param {NodeList} container A DOM container.
   * @returns {MediaProvider}
   */
  add() {
    logger.error('MediaProvider.add() needs to be implemented within an inheriting class');
    return this;
  }

  /**
   * Remove a DOM container.
   * @param {NodeList} container A DOM container.
   * @returns {MediaProvider}
   */
  remove(container) {
    this.containers.delete(container);
    return this;
  }

  /**
   * Stops all playing videos within the DOM containers.
   * @returns {MediaProvider}
   */
  stop() {
    logger.error('MediaProvider.stop() needs to be implemented within an inheriting class');
    return this;
  }
}

export default MediaProvider;

/* eslint-enable class-methods-use-this */
