/* eslint-disable extra-rules/potential-point-free */
import event from '@shopgate/pwa-core/classes/Event';

/**
 * Class to maintain embedded media within DOM containers.
 */
class EmbeddedMedia {
  /**
   * Constructor
   */
  constructor() {
    this.providers = new Set();

    event.addCallback('routeDidChange', () => { this.stop(); });
    event.addCallback('viewDidDisappear', () => { this.stop(); });
  }

  /**
   * Add a provider for embedded media.
   * @param {Object} provider A provider instance.
   */
  addProvider(provider) {
    this.providers.add(provider);
  }

  /**
   * Remove a provider for embedded media.
   * @param {Object} provider A provider instance.
   */
  removeProvider(provider) {
    this.providers.delete(provider);
  }

  /**
   * Add a DOM container with embedded media.
   * @param {ParentNode} container A DOM container.
   */
  add(container) {
    this.providers.forEach((provider) => {
      provider.add(container);
    });
  }

  /**
   * Remove a DOM container. Should be called whenever a component which hosts a DOM container with
   * embedded media is unmounted.
   * @param {ParentNode} container A DOM container.
   */
  remove(container) {
    this.providers.forEach((provider) => {
      provider.remove(container);
    });
  }

  /**
   * Stops all playing media within the DOM containers.
   */
  stop() {
    this.providers.forEach((provider) => {
      provider.stop();
    });
  }

  /**
   * Check if we have media providers with not-ready SDK
   * @returns {boolean}
   */
  hasNotReady() {
    let hasNotReady = false;
    this.providers.forEach((provider) => {
      if (!provider.sdkReady) {
        hasNotReady = true;
      }
    });
    return hasNotReady;
  }
}

export default new EmbeddedMedia();

/* eslint-enable extra-rules/potential-point-free */
