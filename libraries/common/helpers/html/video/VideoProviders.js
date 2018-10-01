/* eslint-disable extra-rules/potential-point-free */
import event from '@shopgate/pwa-core/classes/Event/index';

/**
 *
 */
class VideoProviders {
  /**
   * Constructor
   */
  constructor() {
    this.providers = new Set();

    event.addCallback('routeDidChange', () => { this.stopVideos(); });
    event.addCallback('viewDidDisappear', () => { this.stopVideos(); });
  }

  /**
   * Adds a video provider.
   * @param {Object} provider A video provider instance.
   */
  add(provider) {
    this.providers.add(provider);
  }

  /**
   * Adds an observed container.
   * @param {NodeList} container HTML widget container.
   */
  addContainer(container) {
    this.providers.forEach((provider) => {
      provider.addContainer(container);
    });
  }

  /**
   * Deletes an observed container.
   * @param {NodeList} container HTML widget container.
   */
  deleteContainer(container) {
    this.providers.forEach((provider) => {
      provider.deleteContainer(container);
    });
  }

  /**
   * Stops all playing videos within the observed containers.
   */
  stopVideos() {
    this.providers.forEach((provider) => {
      provider.stopVideos();
    });
  }
}

export default new VideoProviders();

/* eslint-enable extra-rules/potential-point-free */
