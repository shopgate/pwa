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
   * Retrieves a list of media containers related scripts for Vimeo.
   * @param {ParentNode} container A DOM container that may contain Vimeo iframes.
   * @returns {NodeListOf<Element>}
   */
  getMediaScripts(container) {
    return container.querySelectorAll('script[src*="vimeo.com"]');
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
      this.responsify(iframe);
      players.push(new window.Vimeo.Player(iframe));
    });

    this.containers.set(container, players);

    return this;
  }

  /**
   * Stops all playing videos within the DOM containers.
   * @override
   * @returns {VimeoMediaProvider}
   */
  stop() {
    this.containers.forEach((players) => {
      players.forEach((player) => {
        player.pause();
      });
    });

    return this;
  }

  /**
   * Optimizes video container to make it responsive.
   * @param {Element} container A DOM container.
   * @returns {MediaProvider}
   */
  responsify(container) {
    /**
     * Vimeo embedded code might have a custom responsive container. If that's the case, we
     * don't need to add our own.
     */
    let hasResponsiveContainer = false;

    try {
      // eslint-disable-next-line prefer-const
      let { paddingTop, position } = container.parentElement.style;

      if (
        container.parentElement.children.length === 1 &&
        position === 'relative' &&
        paddingTop.endsWith('%')
      ) {
        paddingTop = parseFloat(paddingTop);
        if (!Number.isNaN(paddingTop) && paddingTop > 50) {
          hasResponsiveContainer = true;
        }
      }
    } catch {
      // Nothing to do here
    }

    if (!hasResponsiveContainer) {
      // Invoke default responsify logic when no container is present
      super.responsify(container);
    }

    return this;
  }
}

export default VimeoMediaProvider;

/* eslint-enable class-methods-use-this */
