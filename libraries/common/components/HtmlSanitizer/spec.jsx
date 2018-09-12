import React from 'react';
import { mount } from 'enzyme';
import { JSDOM } from 'jsdom';
import HtmlSanitizer from './index';

const mockedHandleClick = jest.fn();

describe('<HtmlSanitizer />', () => {
  it('should render the HtmlSanitizer', () => {
    /**
     * The value for html is the HTML-escaped equivalent of the following:
     * <h1>Hello World!</h1>
     * @type {string}
     */
    const html = '&lt;h1&gt;Hello World!&lt;/h1&gt;';

    const wrapper = mount((
      <HtmlSanitizer decode>
        {html}
      </HtmlSanitizer>
    ));

    // Test result of dangerouslySetInnerHTML.
    expect(wrapper.html()).toEqual('<div><h1>Hello World!</h1></div>');
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('strips out images with relative paths', () => {
    const html = `
      <div>
        <a href="foo">
          <img src="bar.jpg" />
        </a>
      </div>
    `;

    const wrapper = mount((
      <HtmlSanitizer>
        {html}
      </HtmlSanitizer>
    ));

    expect(wrapper.html()).not.toContain('<img');
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('does not strip out images with absolute paths', () => {
    const html = `
      <div>
        <a href="foo">
          <img src="http://google.de/bar.jpg" />
        </a>
      </div>
    `;

    const wrapper = mount((
      <HtmlSanitizer>
        {html}
      </HtmlSanitizer>
    ));

    expect(wrapper.html()).toContain('<img');
    expect(wrapper.render()).toMatchSnapshot();
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

    const wrapper = mount((
      <HtmlSanitizer decode>
        {html}
      </HtmlSanitizer>
    ));

    // Test result of dangerouslySetInnerHTML.
    expect(wrapper.html()).toEqual('<div>  <p>Foo Bar</p> </div>');
    expect(wrapper).toMatchSnapshot();
  });

  describe('Link handling', () => {
    beforeEach(() => {
      mockedHandleClick.mockClear();
    });

    it('follows a link from a plain <a>', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const html = '&lt;a id=&quot;link&quot; href=&quot;#follow-me-and-everything-is-alright&quot;&gt;Plain Link&lt;/a&gt;';
      const wrapper = mount(
        (
          <HtmlSanitizer
            decode
            settings={{ handleClick: mockedHandleClick }}
          >
            {html}
          </HtmlSanitizer>
        ), {
          attachTo: doc.getElementsByTagName('div')[0],
        }
      );

      const aTag = doc.getElementsByTagName('a')[0];
      aTag.closest = () => aTag;
      const event = {
        target: aTag,
        preventDefault: () => {},
      };
      wrapper.instance().handleTap(event);

      expect(mockedHandleClick).toHaveBeenCalledTimes(1);
      expect(mockedHandleClick).toHaveBeenCalledWith('#follow-me-and-everything-is-alright');
    });

    it('follows a link from a <a> with other HTML inside', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const html = '&lt;a id=&quot;link&quot; href=&quot;#I-ll-be-the-one-to-tuck-you-in-at-night&quot;&gt;&lt;span&gt;Span Link&lt;/span&gt;&lt;/a&gt;';
      const wrapper = mount(
        (
          <HtmlSanitizer
            decode
            settings={{ handleClick: mockedHandleClick }}
          >
            {html}
          </HtmlSanitizer>
        ), {
          attachTo: doc.getElementsByTagName('div')[0],
        }
      );

      const aTag = doc.getElementsByTagName('a')[0];
      const spanTag = doc.getElementsByTagName('span')[0];
      spanTag.closest = () => aTag;
      const event = {
        target: spanTag,
        preventDefault: () => {},
      };
      wrapper.instance().handleTap(event);

      expect(mockedHandleClick).toHaveBeenCalledTimes(1);
      expect(mockedHandleClick).toHaveBeenCalledWith('#I-ll-be-the-one-to-tuck-you-in-at-night');
    });
  });
});
