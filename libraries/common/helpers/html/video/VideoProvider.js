/**
 * The video provider class.
 */
class VideoProvider {
  /**
   * Constructor.
   */
  constructor() {
    this.containers = new Map();
  }

  /**
   * Deletes an observed container.
   * @param {NodeList} container HTML widget container.
   */
  deleteContainer(container) {
    this.containers.delete(container);
  }
}

export default VideoProvider;
