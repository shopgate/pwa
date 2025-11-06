/** @jest-environment jsdom */

import {
  handleYouTube,
  getStyles,
} from './handleDOM';

const mockedEvent = jest.fn();

jest.mock('@shopgate/pwa-core/classes/Event', () => ({
  addCallback(...args) {
    mockedEvent(...args);
  },
}));

describe('handleDOM', () => {
  describe('handleYouTube', () => {
    const postMessageMock = jest.fn();
    const srcs = [
      'https://youtube.com/fooo?enablejsapi=0&controls=0',
      'https://youtube.com/fooo?controls=0&enablejsapi=0',
      'https://youtube.com/fooo',
    ];

    it('should sanitize youtube iframes', () => {
      const container = document.createElement('div');
      container.innerHTML = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');

      handleYouTube(container);

      const iframes = container.querySelectorAll('iframe');

      iframes.forEach((iframe) => {
        // Ensure postMessage exists
        if (!iframe.contentWindow) {
          Object.defineProperty(iframe, 'contentWindow', {
            value: { postMessage: postMessageMock },
            configurable: true,
          });
        } else {
          // eslint-disable-next-line no-param-reassign
          iframe.contentWindow.postMessage = postMessageMock;
        }

        const newSrc = iframe.getAttribute('src');
        expect(newSrc).toContain('enablejsapi=1');
        expect(newSrc).toContain('controls=1');
      });
      expect(mockedEvent).toHaveBeenCalledTimes(2);
    });

    it('should call stopPlayer', () => {
      mockedEvent.mock.calls[0][1]();
      mockedEvent.mock.calls[1][1]();
      expect(postMessageMock).toHaveBeenCalledTimes(6);
      expect(postMessageMock).toHaveBeenCalledWith('{"event":"command","func":"stopVideo","args":""}', '*');
    });
  });

  describe('getStyles', () => {
    it('should get styles', () => {
      const container = document.createElement('div');
      container.innerHTML = '<style>body { background: red;}</style>';
      const styles = getStyles(container);

      expect(styles.length).toBe(1);
    });
  });
});
