import { JSDOM } from 'jsdom';
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
      const html = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');
      const dom = new JSDOM(html);
      handleYouTube(dom.window.document);

      const iframes = dom.window.document.querySelectorAll('iframe');
      iframes.forEach((iframeConstantForLinter) => {
        const ifr = iframeConstantForLinter;
        ifr.contentWindow.postMessage = postMessageMock;
        const newSrc = ifr.src;
        expect(newSrc.includes('enablejsapi=1')).toBe(true);
        expect(newSrc.includes('controls=1')).toBe(true);
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
      const dom = new JSDOM('<style>body { background: red;}</style>');
      const styles = getStyles(dom.window.document);
      expect(styles.length).toBe(1);
    });
  });
});
