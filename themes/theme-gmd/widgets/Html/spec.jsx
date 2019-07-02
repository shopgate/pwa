import React from 'react';
import { mount } from 'enzyme';
import { JSDOM } from 'jsdom';
import variables from 'Styles/variables';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import HtmlWidget from './index';

const mockConstructor = jest.fn();
jest.mock('@shopgate/pwa-common/components/Router/helpers/parsed-link', () => (class {
  /**
   * Mocked version of the ParsedLink constructor.
   * @param {string} href Link location.
   */
  constructor(href) {
    mockConstructor(href);
  }

  /* eslint-disable class-methods-use-this */
  /**
   * Mocked version of open function.
   */
  open() {}
  /* eslint-enable class-methods-use-this */
}));

jest.mock('@shopgate/pwa-common/components/EmbeddedMedia', () => (
  ({ children }) => children
));

describe('<HtmlWidget />', () => {
  describe('Basic rendering', () => {
    const settings = {
      defaultPadding: false,
      // The value for html is the HTML-escaped equivalent of the following:
      // <h1>Hello World!</h1>
      html: '&lt;h1&gt;Hello World!&lt;/h1&gt;',
    };

    const renderSpy = jest.spyOn(HtmlWidget.prototype, 'render');
    const embeddedMediaAddSpy = jest.spyOn(embeddedMedia, 'add');
    const embeddedMediaRemoveSpy = jest.spyOn(embeddedMedia, 'remove');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render the HtmlWidget', () => {
      const wrapper = mount(<HtmlWidget settings={settings} />);
      expect(wrapper.render()).toMatchSnapshot();

      expect(wrapper.find('div').prop('style')).toEqual({});
      expect(embeddedMediaAddSpy).toHaveBeenCalledTimes(1);
      expect(embeddedMediaAddSpy).toHaveBeenCalledWith(wrapper.instance().htmlContainer);
    });

    it('should render the HtmlWidget with a padding', () => {
      const wrapper = mount(<HtmlWidget settings={{
        ...settings,
        defaultPadding: true,
      }}
      />);

      expect(wrapper.render()).toMatchSnapshot();
      expect(wrapper.find('div').prop('style').padding).toBe(variables.gap.big);
    });

    it('should re-render when html updates', () => {
      const updatedHTML = settings.html.replace('World', 'User');
      const wrapper = mount(<HtmlWidget settings={settings} />);

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.html().includes('<h1>Hello World!</h1>')).toBe(true);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Update with the same settings - no re-render expected
      wrapper.setProps({
        settings,
      });

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Update with new HTML - re-render expected
      wrapper.setProps({
        settings: {
          ...settings,
          html: updatedHTML,
        },
      });

      expect(wrapper).toMatchSnapshot();
      expect(renderSpy).toHaveBeenCalledTimes(2);

      wrapper.setProps({
        settings: {
          ...settings,
          defaultPadding: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
      expect(renderSpy).toHaveBeenCalledTimes(3);
      expect(embeddedMediaAddSpy).toHaveBeenCalledTimes(3);
      expect(embeddedMediaAddSpy).toHaveBeenNthCalledWith(1, wrapper.instance().htmlContainer);
      expect(embeddedMediaAddSpy).toHaveBeenNthCalledWith(2, wrapper.instance().htmlContainer);
      expect(embeddedMediaAddSpy).toHaveBeenNthCalledWith(3, wrapper.instance().htmlContainer);
    });

    it('should remove embedded media handlers on unmount', () => {
      const wrapper = mount(<HtmlWidget settings={settings} />);
      const { htmlContainer } = wrapper.instance();
      wrapper.unmount();

      expect(embeddedMediaRemoveSpy).toHaveBeenCalledTimes(1);
      expect(embeddedMediaRemoveSpy).toHaveBeenCalledWith(htmlContainer);
    });
  });

  it('strips out the script tags', () => {
    const settings = {
      defaultPadding: false,
      // The value for html is the HTML-escaped equivalent of the following:
      // <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
      // <script type="text/javascript">var x = 42;</script>
      // <p>Foo Bar</p>
      // <script>var y = 23;</script>
      html: '&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js&quot;&gt;&lt;/script&gt; &lt;script type=&quot;text/javascript&quot;&gt;var x = 42;&lt;/script&gt; &lt;p&gt;Foo Bar&lt;/p&gt; &lt;script&gt;var y = 23;&lt;/script&gt;',
    };

    const wrapper = mount(<HtmlWidget settings={settings} />);

    expect(wrapper).toMatchSnapshot();
  });

  describe('Link handling', () => {
    beforeEach(() => {
      mockConstructor.mockClear();
    });

    it('follows a link from a plain <a>', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const settings = {
        defaultPadding: false,
        html: '&lt;a id=&quot;link&quot; href=&quot;#follow-me-and-everything-is-alright&quot;&gt;Plain Link&lt;/a&gt;',
      };
      const wrapper = mount(<HtmlWidget settings={settings} />, {
        attachTo: doc.getElementsByTagName('div')[0],
      });

      const aTag = doc.getElementsByTagName('a')[0];
      aTag.closest = () => aTag;
      const event = {
        target: aTag,
        preventDefault: () => {},
      };

      wrapper.instance().handleTap(event);

      expect(mockConstructor).toHaveBeenCalledTimes(1);
    });

    it('follows a link from a <a> with other HTML inside', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const settings = {
        defaultPadding: false,
        html: '&lt;a id=&quot;link&quot; href=&quot;#I-ll-be-the-one-to-tuck-you-in-at-night&quot;&gt;&lt;span&gt;Span Link&lt;/span&gt;&lt;/a&gt;',
      };
      const wrapper = mount(<HtmlWidget settings={settings} />, {
        attachTo: doc.getElementsByTagName('div')[0],
      });

      const aTag = doc.getElementsByTagName('a')[0];
      const spanTag = doc.getElementsByTagName('span')[0];
      spanTag.closest = () => aTag;
      const event = {
        target: spanTag,
        preventDefault: () => {},
      };

      wrapper.instance().handleTap(event);

      expect(mockConstructor).toHaveBeenCalledTimes(1);
    });
  });
});
