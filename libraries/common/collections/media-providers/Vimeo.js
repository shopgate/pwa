import MediaProvider from './MediaProvider';

const SDK = 'https://player.vimeo.com/api/player.js';
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
    this.sdkReady = false;
    this.sdkUrl = SDK;
    this.deferred = [];
  }

  /**
   * @inheritDoc
   */
  onSdkLoaded() {
    this.sdkReady = true;
    if (this.deferred.length) {
      this.deferred.forEach((container) => {
        this.add(container);
      });
      this.deferred = [];
    }
  }

  /**
   * Check if SDK loaded externally
   * @returns {boolean}
   */
  checkSdk() {
    if (!this.sdkReady && typeof window.Vimeo !== 'undefined') {
      this.sdkReady = true;
    }
    return this.sdkReady;
  }

  /**
   * Add a DOM container with embedded videos.
   * @override
   * @param {ParentNode} container A DOM container.
   * @returns {VimeoMediaProvider}
   */
  add(container) {
    if (!this.checkSdk()) {
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
