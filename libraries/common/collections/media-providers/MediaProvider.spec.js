import { JSDOM } from 'jsdom';
import { logger, i18n } from '@shopgate/engage/core/helpers';
import MediaProvider from './MediaProvider';
import styles from './style';

jest.mock('@shopgate/engage/core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
  i18n: {
    text: jest.fn(key => key),
  },
}));

/**
 * Creates a DOM container with iframes.
 * @param {Array} srcs A list of video URLs.
 * @return {Object}
 */
const createContainer = (srcs) => {
  const html = srcs.map(src => `<iframe src="${src}"></iframe>`).join('');
  return new JSDOM(html).window.document;
};

describe('MediaProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('.constructor()', () => {
    it('should construct as expected', () => {
      const instance = new MediaProvider();
      expect(instance.containers).toBeInstanceOf(Map);
      expect(Array.from(instance.containers)).toHaveLength(0);
    });
  });

  describe('.getMediaContainers()', () => {
    it('should log an error when it is not overwritten', () => {
      const instance = new MediaProvider();
      instance.getMediaContainers();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('.add()', () => {
    it('should log an error when it is not overwritten', () => {
      const instance = new MediaProvider();
      instance.add();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('.stop()', () => {
    it('should log an error when it is not overwritten', () => {
      const instance = new MediaProvider();
      instance.stop();
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('.remove()', () => {
    it('should remove containers as expected', () => {
      const instance = new MediaProvider();
      const containerOne = createContainer(['http://www.provider-one.com/video']);
      const containerTwo = createContainer(['http://www.provider-two.com/video']);

      instance.containers.set(containerOne, containerOne);
      instance.containers.set(containerTwo, containerTwo);

      instance.remove(containerTwo);

      expect(instance.containers.size).toBe(1);
      expect(instance.containers.get(containerTwo)).toBeUndefined();
      expect(instance.containers.get(containerOne)).toEqual(containerOne);

      instance.remove(containerOne);

      expect(instance.containers.size).toBe(0);
    });
  });

  describe('.responsify()', () => {
    it('should responsify a dom container', () => {
      const dom = document.createElement('body');
      dom.innerHTML = '<iframe width="560" height="315" />';
      const container = dom.querySelectorAll('iframe')[0];

      const instance = new MediaProvider();
      instance.responsify(container);

      expect(dom).toMatchSnapshot();
      expect(container.getAttribute('height')).toBeNull();
      expect(container.getAttribute('width')).toBeNull();
      expect(container.closest('div').className).toBe(styles.responsiveContainer.toString());
    });

    it('should not responsify already responsive element', () => {
      const dom = document.createElement('body');
      dom.innerHTML = '<div style="padding:52.71% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/326436012?autoplay=1&title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe></div>';
      const container = dom.querySelectorAll('iframe')[0];

      const instance = new MediaProvider();
      instance.responsify(container);

      expect(dom).toMatchSnapshot();
      expect(container.getAttribute('height')).toBeNull();
      expect(container.getAttribute('width')).toBeNull();
      expect(container.closest('div').className).toBe(styles.responsiveContainer.toString());
    });
  });

  describe('.handleCookieConsent()', () => {
    let instance;
    let dom;

    beforeAll(() => {
      instance = new MediaProvider();
      instance.getMediaContainers = container => container.querySelectorAll('iframe');
    });

    beforeEach(() => {
      dom = document.createElement('body');
    });

    it('should not modify the dom container when no media containers where found', () => {
      dom.innerHTML = '<div></div>';
      instance.handleCookieConsent(dom);

      expect(dom).toMatchSnapshot();
    });

    it('should not modify the dom container when media containers where found and comfort cookies are accepted', () => {
      dom.innerHTML = '<div><iframe src="some/url" /></div>';
      instance.handleCookieConsent(dom, { comfortCookiesAccepted: true });

      expect(dom).toMatchSnapshot();
      expect(dom.querySelectorAll('iframe')[0].getAttribute('src')).toBe('some/url');
    });

    it('should replace the iframe with the cookie consent message container when comfort cookies are not accepted', () => {
      dom.innerHTML = '<div><iframe src="some/url" /></div>';
      instance.handleCookieConsent(dom, { comfortCookiesAccepted: false });

      expect(dom).toMatchSnapshot();
      expect(dom.querySelectorAll('iframe')).toHaveLength(0);
      expect(dom.querySelector('.common__media-provider_cookie-consent-message-container_message').textContent).toBe(i18n.text('htmlSanitizer.videoCookieConsent.message'));
      expect(dom.querySelector('.common__media-provider_cookie-consent-message-container_link').textContent).toBe(i18n.text('htmlSanitizer.videoCookieConsent.link'));
    });
  });

  describe('.injectCookieConsentMessage()', () => {
    let instance;
    let dom;

    beforeAll(() => {
      instance = new MediaProvider();
      instance.getMediaContainers = container => container.querySelectorAll('iframe');
    });

    beforeEach(() => {
      dom = document.createElement('body');
    });

    it('should add the cookie consent message container', () => {
      dom.innerHTML = '<div></div>';
      instance.injectCookieConsentMessage(dom);

      expect(dom).toMatchSnapshot();
      expect(dom.querySelectorAll('iframe')).toHaveLength(0);
      expect(dom.querySelector('.common__media-provider_cookie-consent-message-container_message').textContent).toBe(i18n.text('htmlSanitizer.videoCookieConsent.message'));
      expect(dom.querySelector('.common__media-provider_cookie-consent-message-container_link').textContent).toBe(i18n.text('htmlSanitizer.videoCookieConsent.link'));
    });
  });
});
