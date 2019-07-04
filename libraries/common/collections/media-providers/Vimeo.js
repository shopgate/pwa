/* eslint-disable extra-rules/potential-point-free */

const scriptUrl = 'https://player.vimeo.com/api/player.js';

/**
 * The Vimeo media provider class.
 */
class VimeoMediaProvider {
  /**
   * Constructor.
   */
  constructor() {
    this.containers = new Map();
    this.isPending = true;
    this.remoteScriptUrl = scriptUrl;
    this.deferred = [];
  }

  /**
   * Checks if the Video player script is already available.
   * If not, it injects it into the DOM and adds deferred containers.
   * @private
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
   * @param {NodeList} container A DOM container.
   */
  add(container) {
    if (!this.checkScriptLoadingStatus()) {
      this.deferred.push(container);
      return;
    }

    const iframes = container.querySelectorAll('iframe[src*="vimeo.com"]');

    if (!iframes.length) {
      return;
    }

    const players = [];

    iframes.forEach((iframe) => {
      players.push(new window.Vimeo.Player(iframe));
    });

    this.containers.set(container, players);
  }

  /**
   * Remove a DOM container.
   * @param {NodeList} container A DOM container.
   */
  remove(container) {
    this.containers.delete(container);
  }

  /**
   * Stops all playing videos within the DOM containers.
   */
  stop() {
    this.containers.forEach((players) => {
      players.forEach((player) => {
        player.pause();
      });
    });
  }
}

/* eslint-enable extra-rules/potential-point-free */

export default VimeoMediaProvider;
