import URLSearchParams from 'url-search-params';
import MediaProvider from './MediaProvider';

/* eslint-disable class-methods-use-this */

/**
 * The YouTube media provider class.
 */
class YouTubeMediaProvider extends MediaProvider {
  /**
   * Retrieves a list of media containers for YouTube.
   * @param {ParentNode} container A DOM container that may contain YouTube iframes.
   * @returns {NodeListOf<Element>}
   */
  getMediaContainers(container) {
    return container
      .querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]');
  }

  /**
   * Add a DOM container with embedded videos.
   * @override
   * @param {ParentNode} container A DOM container.
   * @returns {YouTubeMediaProvider}
   */
  add(container) {
    const iframes = this.getMediaContainers(container);

    if (!iframes.length) {
      return this;
    }

    this.containers.set(container, iframes);

    return this;
  }

  /**
   * Applies optimizations to embedded media iframes within the given container.
   * Common enhancements include adding responsive wrappers and appropriate
   * sandbox attributes to improve security and layout behavior.
   *
   * @param {Document} document - The DOM document containing iframes to optimize.
   * @returns {YouTubeMediaProvider}
   */
  applyIframeOptimizations(document) {
    const iframes = this.getMediaContainers(document);

    if (!iframes.length) {
      return this;
    }

    // Update the video urls to enable stopping videos via the event API.
    iframes.forEach((iframe, index) => {
      // Block clicks on YouTube icon
      iframes[index].setAttribute('sandbox', 'allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation');

      this.responsify(iframe);

      const src = iframe.getAttribute('src');

      const [url, query] = src.split('?');
      const urlParams = new URLSearchParams(query);

      // Enable the js api to allow sending events to the iframe.
      urlParams.set('enablejsapi', 1);
      // Enable controls to avoid the iframe not being resumable because of controls=0 param on ios.
      urlParams.set('controls', 1);

      iframes[index].setAttribute('src', `${url}?${urlParams.toString()}`);
    });

    return this;
  }

  /**
   * Stops all playing videos within the DOM containers.
   * @override
   * @returns {YouTubeMediaProvider}
   */
  stop() {
    // Select all iframes in the document. Actually this should be done via the iframes
    // registered in this.containers, but that doesn't seem to work reliably anymore.
    // Since we had to find a quick fix for CURB-5033 we now select all iframes in the document
    // via the media container selector and then stop the videos.
    const iframes = this.getMediaContainers(document);

    iframes.forEach((iframe) => {
      if (typeof iframe?.contentWindow?.postMessage === 'function') {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'stopVideo',
            args: [],
          }),
          '*'
        );
      }
    });

    return this;
  }
}

export default YouTubeMediaProvider;

/* eslint-enable class-methods-use-this */
