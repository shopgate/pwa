/* eslint-disable extra-rules/potential-point-free */
import URLSearchParams from 'url-search-params';

/**
 * The YouTube video provider class.
 */
class YouTubeVideoProvider {
  /**
   * Constructor.
   */
  constructor() {
    this.containers = new Map();
  }

  /**
   * Add a DOM container with embedded videos.
   * @param {NodeList} container A DOM container.
   */
  addContainer(container) {
    const iframes = container
      .querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]');

    if (!iframes.length) {
      return;
    }

    // Update the video urls to enable stopping videos via the event API.
    iframes.forEach((iframe, index) => {
      const { src } = iframe;

      const [url, query] = src.split('?');
      const urlParams = new URLSearchParams(query);

      // Enable the js api to allow sending events to the iframe.
      urlParams.set('enablejsapi', 1);
      // Enable controls to avoid the iframe not being resumable because of controls=0 param on ios.
      urlParams.set('controls', 1);
      // Enable inline playing for the video.
      urlParams.set('playsinline', 1);

      iframes[index].src = `${url}?${urlParams.toString()}`;
    });

    this.containers.set(container, iframes);
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
    this.containers.forEach((iframes) => {
      iframes.forEach((iframe) => {
        if (iframe.contentWindow && iframe.contentWindow.postMessage) {
          iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        }
      });
    });
  }
}

/* eslint-enable extra-rules/potential-point-free */

export default YouTubeVideoProvider;
