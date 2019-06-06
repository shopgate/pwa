import MediaProvider from './MediaProvider';

/**
 * The Vimeo media provider class.
 */
class VimeoMediaProvider extends MediaProvider {
  /**
   * Constructor.
   */
  constructor() {
    super();
    this.playerReady = false;
    this.deferred = [];

    this.initPlayer();
  }

  /**
   * Checks if the Video player script is already available.
   * If not, it injects it into the DOM and adds deferred containers.
   * @private
   */
  initPlayer() {
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
   * @override
   * @param {NodeList} container A DOM container.
   * @returns {VimeoMediaProvider}
   */
  add(container) {
    if (!this.playerReady) {
      this.deferred.push(container);
      return this;
    }

    const iframes = container.querySelectorAll('iframe[src*="vimeo.com"]');

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
}

export default VimeoMediaProvider;
