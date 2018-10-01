/* eslint-disable extra-rules/potential-point-free */

/**
 * The Vimeo video provider class.
 */
class VimeoVideoProvider {
  /**
   * Constructor.
   */
  constructor() {
    this.containers = new Map();
    this.injectPlayer();
  }

  /**
   * Injects the Vimeo player script into the head.
   */
  injectPlayer = () => {
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';

    document.querySelector('head').appendChild(script);
  }

  /**
   * Add a DOM container with embedded videos.
   * @param {NodeList} container A DOM container.
   */
  addContainer(container) {
    const iframes = container.querySelectorAll('iframe[src*="vimeo.com"]');

    if (!iframes.length || typeof window.Vimeo === 'undefined') {
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
  removeContainer(container) {
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

export default VimeoVideoProvider;
