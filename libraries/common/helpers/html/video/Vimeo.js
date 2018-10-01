import VideoProvider from './VideoProvider';

/**
 * The Vimeo video provider class.
 */
class Vimeo extends VideoProvider {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.injectPlayer();
  }

  /**
   * Injects the Vimeo player script into the DOM.
   */
  injectPlayer = () => {
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';

    document.querySelector('head').appendChild(script);
  }

  /**
   * Adds an observed container.
   * @param {NodeList} container HTML widget container.
   */
  addContainer(container) {
    const iFrames = container.querySelectorAll('iframe[src*="vimeo.com"]');

    if (!iFrames.length) {
      return;
    }

    const players = [];

    iFrames.forEach((iframe) => {
      players.push(new window.Vimeo.Player(iframe));
    });

    this.containers.set(container, players);
  }

  /**
   * Stops all playing videos within the observed containers.
   */
  stopVideos() {
    this.containers.forEach((players) => {
      players.forEach((player) => {
        player.pause();
      });
    });
  }
}

export default new Vimeo();
