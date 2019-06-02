/* eslint-disable extra-rules/potential-point-free */

/**
 * The Vimeo media provider class.
 */
class VimeoMediaProvider {
  /**
   * Constructor.
   */
  constructor() {
    this.containers = new Map();
    this.playerReady = false;
    this.deferred = [];

    this.checkPlayer();
  }

  /**
   * Checks if the Video player script is already available.
   * If not, it injects it into the DOM and adds defferred containers.
   */
  checkPlayer() {
    if (typeof window.Vimeo !== 'undefined') {
      this.playerReady = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;

    script.onload = () => {
      this.playerReady = true;
      this.deferred.forEach((container) => {
        this.add(container);
      });

      this.deferred = [];
    };

    document.querySelector('head').appendChild(script);
  }

  /**
   * Add a DOM container with embedded videos.
   * @param {NodeList} container A DOM container.
   */
  add(container) {
    if (!this.playerReady) {
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
