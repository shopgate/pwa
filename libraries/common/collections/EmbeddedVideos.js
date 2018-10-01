/* eslint-disable extra-rules/potential-point-free */
import event from '@shopgate/pwa-core/classes/Event/index';

/**
 * Class to maintain embedded videos within DOM containers.
 */
class EmbeddedVideos {
  /**
   * Constructor
   */
  constructor() {
    this.providers = new Set();

    event.addCallback('routeDidChange', () => { this.stop(); });
    event.addCallback('viewDidDisappear', () => { this.stop(); });
  }

  /**
   * Add a provider for embedded videos.
   * @param {Object} provider A provider instance.
   */
  addProvider(provider) {
    this.providers.add(provider);
  }

  /**
   * Remove a provider for embedded videos.
   * @param {Object} provider A provider instance.
   */
  removeProvider(provider) {
    this.providers.delete(provider);
  }

  /**
   * Add a DOM container with embedded videos.
   * @param {NodeList} container A DOM container.
   */
  addContainer(container) {
    this.providers.forEach((provider) => {
      provider.addContainer(container);
    });
  }

  /**
   * Remove a DOM container. Should be called whenever a component which hosts a DOM container with
   * embedded videos is unmounted.
   * @param {NodeList} container A DOM container.
   */
  removeContainer(container) {
    this.providers.forEach((provider) => {
      provider.removeContainer(container);
    });
  }

  /**
   * Stops all playing videos within the DOM containers.
   */
  stop() {
    this.providers.forEach((provider) => {
      provider.stop();
    });
  }
}

export default new EmbeddedVideos();

/* eslint-enable extra-rules/potential-point-free */
