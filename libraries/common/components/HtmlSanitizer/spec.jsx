/** @jest-environment jsdom */

import { render, screen, fireEvent } from '@testing-library/react';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import EmbeddedMedia from '../EmbeddedMedia';
import HtmlSanitizer from './index';

jest.mock('../EmbeddedMedia', () => jest.fn(({ children }) => children));
jest.mock('./connector', () => Cmp => Cmp);

/**
 * @param {string} html HTML markup.
 * @param {Object} props Component props.
 * @returns {JSX.Element}
 */
const createElement = (html, props = {}) => (
  <HtmlSanitizer navigate={() => {}} {...props}>
    {html}
  </HtmlSanitizer>
);

/**
 * @param {string} html HTML markup.
 * @param {Object} props Component props.
 * @returns {Object}
 */
const createWrapper = (html, props = {}) => render(createElement(html, props));

describe('<HtmlSanitizer />', () => {
  let embeddedMediaAddSpy;
  let embeddedMediaRemoveSpy;
  let embeddedMediaHandleCookieConsentSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    embeddedMediaAddSpy = jest.spyOn(embeddedMedia, 'add');
    embeddedMediaRemoveSpy = jest.spyOn(embeddedMedia, 'remove');
    embeddedMediaHandleCookieConsentSpy = jest.spyOn(embeddedMedia, 'handleCookieConsent');
  });

  it('should render the HtmlSanitizer', () => {
    /**
     * The value for html is the HTML-escaped equivalent of the following:
     * <h1>Hello World!</h1>
     * @type {string}
     */
    const html = '&lt;h1&gt;Hello World!&lt;/h1&gt;';

    const { container } = createWrapper(html, { decode: true });

    expect(container.innerHTML).toEqual('<div class="common__html-sanitizer"><h1>Hello World!</h1></div>');
    expect(screen.getByRole('heading', {
      level: 1,
      name: 'Hello World!',
    })).toBeInTheDocument();
  });

  it('should add and remove handlers for embedded media', () => {
    const { container, rerender, unmount } = createWrapper('<div></div>', { decode: true });
    const ref = container.firstChild;
    expect(ref).toHaveClass('common__html-sanitizer');
    expect(embeddedMediaAddSpy).toHaveBeenCalledTimes(1);
    expect(embeddedMediaAddSpy).toHaveBeenCalledWith(ref);
    expect(embeddedMediaRemoveSpy).toHaveBeenCalledTimes(0);

    rerender(createElement('<span></span>', { decode: true }));
    expect(embeddedMediaAddSpy).toHaveBeenCalledTimes(2);
    expect(embeddedMediaAddSpy).toHaveBeenCalledWith(ref);
    expect(embeddedMediaRemoveSpy).toHaveBeenCalledTimes(0);

    unmount();
    expect(embeddedMediaAddSpy).toHaveBeenCalledTimes(2);
    expect(embeddedMediaRemoveSpy).toHaveBeenCalledTimes(1);
    expect(embeddedMediaRemoveSpy).toHaveBeenCalledWith(ref);
  });

  it('strips out images with relative paths', () => {
    const html = `
      <div>
      <style>a { color: red }</style>
        <a href="foo">
          <img src="bar.jpg" />
        </a>
      </div>
    `;

    const { container } = createWrapper(html);

    expect(container.innerHTML).not.toContain('<img');
    expect(container.innerHTML).toContain('<style>');
    expect(container.firstChild).toHaveClass('common__html-sanitizer');
    expect(screen.getByRole('link')).toHaveAttribute('href', 'foo');
    expect(screen.getByRole('link').childElementCount).toBe(0);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should move style blocks out of the content', () => {
    const html = `
      <div>
        <style>a { color: red }</style>
        <a href="foo">
          <img src="bar.jpg" />
        </a>
      </div>
    `;

    const { container } = createWrapper(html, { processStyles: true });
    expect(container.innerHTML).not.toContain('<style>');
  });

  it('does not strip out images with absolute paths', () => {
    const html = `
      <div>
        <a href="foo">
          <img src="http://google.de/bar.jpg" />
        </a>
      </div>
    `;

    const { container } = createWrapper(html);

    expect(container.innerHTML).toContain('<img');
    expect(container.firstChild).toHaveClass('common__html-sanitizer');
    expect(screen.getByRole('link')).toHaveAttribute('href', 'foo');
    expect(screen.getByRole('link')).toContainElement(screen.getByRole('img'));
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://google.de/bar.jpg');
  });

  it('strips out the script tags', () => {
    /**
     * The value for html is the HTML-escaped equivalent of the following:
     * <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
     * <script type="text/javascript">var x = 42;</script>
     * <p>Foo Bar</p>
     * <script>var y = 23;</script>
     * @type {string}
     */
    const html = '&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js&quot;&gt;&lt;/script&gt; &lt;script type=&quot;text/javascript&quot;&gt;var x = 42;&lt;/script&gt; &lt;p&gt;Foo Bar&lt;/p&gt; &lt;script&gt;var y = 23;&lt;/script&gt;';

    const { container } = createWrapper(html, { decode: true });

    expect(container.innerHTML).toEqual('<div class="common__html-sanitizer">  <p>Foo Bar</p> </div>');
    expect(EmbeddedMedia.mock.lastCall[0]).toEqual(expect.objectContaining({
      cookieConsentSettings: {
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: false,
      },
    }));
  });

  describe('Link handling', () => {
    const mockedHandleClick = jest.fn();

    beforeEach(() => {
      mockedHandleClick.mockClear();
    });

    it('follows a link from a plain <a>', () => {
      const html = '&lt;a id=&quot;link&quot; href=&quot;#follow-me-and-everything-is-alright&quot;&gt;Plain Link&lt;/a&gt;';
      createWrapper(html, {
        decode: true,
        settings: { handleClick: mockedHandleClick },
      });

      fireEvent.click(screen.getByRole('link', { name: 'Plain Link' }));

      expect(mockedHandleClick).toHaveBeenCalledTimes(1);
      expect(mockedHandleClick).toHaveBeenCalledWith('#follow-me-and-everything-is-alright', '');
    });

    it('follows a link from a <a> with other HTML inside', () => {
      const html = '&lt;a id=&quot;link&quot; target=&quot;_blank&quot; href=&quot;#I-ll-be-the-one-to-tuck-you-in-at-night&quot;&gt;&lt;span&gt;Span Link&lt;/span&gt;&lt;/a&gt;';
      createWrapper(html, {
        decode: true,
        settings: { handleClick: mockedHandleClick },
      });

      fireEvent.click(screen.getByText('Span Link'));

      expect(mockedHandleClick).toHaveBeenCalledTimes(1);
      expect(mockedHandleClick).toHaveBeenCalledWith('#I-ll-be-the-one-to-tuck-you-in-at-night', '_blank');
    });
  });

  describe('Cookie consent handling', () => {
    it('should invoke handleCookieConsent method of embedded media with default cookie consent settings', () => {
      createWrapper('<div></div>', { decode: true });

      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledTimes(1);
      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledWith(expect.any(Document), {
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: false,
      });
    });

    it('should invoke handleCookieConsent method of embedded media with accepted comfort cookies', () => {
      createWrapper('<div></div>', {
        decode: true,
        comfortCookiesAccepted: true,
      });

      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledTimes(1);
      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledWith(expect.any(Document), {
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: false,
      });
    });

    it('should invoke handleCookieConsent method of embedded media with accepted statistics cookies', () => {
      createWrapper('<div></div>', {
        decode: true,
        statisticsCookiesAccepted: true,
      });

      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledTimes(1);
      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledWith(expect.any(Document), {
        comfortCookiesAccepted: false,
        statisticsCookiesAccepted: true,
      });
    });

    it('should invoke handleCookieConsent method of embedded media with all cookies accepted', () => {
      createWrapper('<div></div>', {
        decode: true,
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: true,
      });

      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledTimes(1);
      expect(embeddedMediaHandleCookieConsentSpy).toHaveBeenCalledWith(expect.any(Document), {
        comfortCookiesAccepted: true,
        statisticsCookiesAccepted: true,
      });
    });
  });
});
