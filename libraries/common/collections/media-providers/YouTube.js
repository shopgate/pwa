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

    // Update the video urls to enable stopping videos via the event API.
    iframes.forEach((iframe, index) => {
      // Block clicks on YouTube icon
      iframes[index].sandbox = 'allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation';

      this.responsify(iframe);

      const { src } = iframe;

      const [url, query] = src.split('?');
      const urlParams = new URLSearchParams(query);

      // Enable the js api to allow sending events to the iframe.
      urlParams.set('enablejsapi', 1);
      // Enable controls to avoid the iframe not being resumable because of controls=0 param on ios.
      urlParams.set('controls', 1);

      iframes[index].src = `${url}?${urlParams.toString()}`;
    });

    this.containers.set(container, iframes);

    return this;
  }

  /**
   * Stops all playing videos within the DOM containers.
   * @override
   * @returns {YouTubeMediaProvider}
   */
  stop() {
    this.containers.forEach((iframes) => {
      iframes.forEach((iframe) => {
        if (iframe.contentWindow && iframe.contentWindow.postMessage) {
          iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        }
      });
    });

    return this;
  }
}

export default YouTubeMediaProvider;

/* eslint-enable class-methods-use-this */
