import MediaProvider from './MediaProvider';

/* eslint-disable class-methods-use-this */

const scriptUrl = 'https://player.vimeo.com/api/player.js';
/**
 * The Vimeo media provider class.
 */
class VimeoMediaProvider extends MediaProvider {
  /**
   * Constructor.
   */
  constructor() {
    super();
    // Need to check Vimeo.Player presence later
    this.isPending = true;
    this.remoteScriptUrl = scriptUrl;
    this.deferred = [];
  }

  /**
   * Retrieves a list of media containers for Vimeo.
   * @param {ParentNode} container A DOM container that may contain Vimeo iframes.
   * @returns {NodeListOf<Element>}
   */
  getMediaContainers(container) {
    return container.querySelectorAll('iframe[src*="vimeo.com"]');
  }

  /**
   * @inheritDoc
   */
  onScriptLoaded() {
    this.isPending = false;
    if (this.deferred.length) {
      this.deferred.forEach((container) => {
        this.add(container);
      });
      this.deferred = [];
    }
  }

  /**
   * Check if the Provider script to be loaded externally is finished loading
   * @returns {boolean}
   */
  checkScriptLoadingStatus() {
    if (this.isPending && typeof window.Vimeo !== 'undefined') {
      this.isPending = false;
    }
    return !this.isPending;
  }

  /**
   * Add a DOM container with embedded videos.
   * @override
   * @param {ParentNode} container A DOM container.
   * @returns {VimeoMediaProvider}
   */
  add(container) {
    if (!this.checkScriptLoadingStatus()) {
      this.deferred.push(container);
      return this;
    }

    const iframes = this.getMediaContainers(container);

    if (!iframes.length) {
      return this;
    }

    const players = [];

    iframes.forEach((iframe) => {
      players.push(new window.Vimeo.Player(iframe));
    });

    this.containers.set(container, players);

    return this;
  }

  /**
   * Applies optimizations to embedded media iframes within the given container.
   * Common enhancements include adding responsive wrappers and appropriate
   * sandbox attributes to improve security and layout behavior.
   *
   * @param {Document} document - The DOM document containing iframes to optimize.
   * @returns {YouTubeMediaProvider}
   */
  applyIframeOptimizations(document) {
    const iframes = this.getMediaContainers(document);

    if (!iframes.length) {
      return this;
    }

    iframes.forEach((iframe, index) => {
      // Block clicks on Vimeo icon
      iframes[index].setAttribute('sandbox', 'allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation');

      this.responsify(iframe);
    });

    return this;
  }

  /**
   * Stops all playing videos within the DOM containers.
   * @override
   * @returns {VimeoMediaProvider}
   */
  stop() {
    // Select all iframes in the document. Actually this should be done via the iframes
    // registered in this.containers, but that doesn't seem to work reliably anymore.
    // Since we had to find a quick fix for CURB-5033 we now select all iframes in the document
    // via the media container selector and then stop the videos.
    const iframes = this.getMediaContainers(document);

    iframes.forEach((iframe) => {
      try {
        const player = new window.Vimeo.Player(iframe);

        player.pause().catch(() => {
          // Ignore errors
        });
      } catch (e) {
        // Ignore errors
      }
    });

    return this;
  }

  /**
   * Searches for embedded media and replaces it with a placeholder element when comfort cookie
   * consent is not accepted.
   *
   * Should be called before media container / markup is mounted to the DOM.
   * @param {ParentNode} container A DOM container.
   * @param {Object} [cookieConsentSettings] Additional settings related to cookie consent.
   * @param {boolean} [cookieConsentSettings.comfortCookiesAccepted] Whether comfort cookies
   * are accepted.
   * @param {boolean} [cookieConsentSettings.statisticsCookiesAccepted] Whether statistics cookies
   * are accepted.
   * @override
   * @returns {VimeoMediaProvider}
   */
  handleCookieConsent(container, cookieConsentSettings) {
    // Remove Vimeo player scripts since the VimeoMediaProvider has custom logic for it
    container.querySelectorAll('script[src*="vimeo.com"]').forEach((entry) => {
      entry.remove();
    });

    return super.handleCookieConsent(container, cookieConsentSettings);
  }
}

export default VimeoMediaProvider;

/* eslint-enable class-methods-use-this */
