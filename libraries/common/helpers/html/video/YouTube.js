import VideoProvider from './VideoProvider';

/**
 * The YouTube video provider class.
 */
class YouTube extends VideoProvider {
  /**
   * Adds an observed container.
   * @param {NodeList} container HTML widget container.
   */
  addContainer(container) {
    const iFrames = container.querySelectorAll('iframe[src*="youtube"]');

    if (!iFrames.length) {
      return;
    }

    iFrames.forEach((iframe, index) => {
      let { src } = iframe;

      // Enable the js api
      if (src.includes('enablejsapi=0')) {
        src = src.replace('enablejsapi=0', 'enablejsapi=1');
      }

      if (!src.includes('enablejsapi')) {
        const queryChar = src.includes('?') ? '&' : '?';
        src += `${queryChar}enablejsapi=1`;
      }

      if (!src.includes('playsinline')) {
        const queryChar = src.includes('?') ? '&' : '?';
        src += `${queryChar}playsinline=1`;
      }

      // Set controls to avoid the iframe not being resumable because of controls=0 param on ios.
      if (!src.includes('controls')) {
        src += '&controls=1';
      } else if (src.includes('controls=0')) {
        src = src.replace('controls=0', 'controls=1');
      }

      iFrames[index].src = src;
    });

    this.containers.set(container, iFrames);
  }

  /**
   * Stops all playing videos within the observed containers.
   */
  stopVideos() {
    const cmdStop = '{"event":"command","func":"stopVideo","args":""}';
    this.containers.forEach((players) => {
      players.forEach((iframe) => {
        if (iframe.contentWindow && iframe.contentWindow.postMessage) {
          iframe.contentWindow.postMessage(cmdStop, '*');
        }
      });
    });
  }
}

export default new YouTube();
