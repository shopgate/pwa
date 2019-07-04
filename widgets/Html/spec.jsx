import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { JSDOM } from 'jsdom';
import variables from 'Styles/variables';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import { configureStore } from '@shopgate/pwa-common/store';
import reducers from 'Pages/reducers';
import HtmlWidget from './index';

const store = configureStore(reducers, []);

jest.mock('@shopgate/pwa-common/components/EmbeddedMedia', () => (
  ({ children }) => children
));

describe.skip('<HtmlWidget />', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    it('should render the HtmlWidget', () => {
      const wrapper = mount((
        <Provider store={store}>
          <HtmlWidget settings={settings} navigate={navigate} />
        </Provider>
      ));

      expect(wrapper.render()).toMatchSnapshot();
      expect(wrapper.childAt(0).prop('style')).toEqual({});
      expect(embeddedMediaAddSpy).toHaveBeenCalledTimes(1);
      expect(embeddedMediaAddSpy).toHaveBeenCalledWith(wrapper.instance().htmlContainer);
    });

    it('should render the HtmlWidget with a padding', () => {
      const wrapper = mount((
        <Provider store={store}>
          <HtmlWidget
            settings={{
              ...settings,
              defaultPadding: true,
            }}
            navigate={navigate}
          />
        </Provider>
      ));

      expect(wrapper.render()).toMatchSnapshot();
      expect(wrapper.childAt(0).prop('style').padding).toBe(variables.gap.big);
    });

    it('should re-render when html updates', () => {
      const updatedHTML = settings.html.replace('World', 'User');
      const wrapper = mount((
        <Provider store={store}>
          <HtmlWidget settings={settings} navigate={navigate} />
        </Provider>
      ));

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
      const wrapper = mount((
        <Provider store={store}>
          <HtmlWidget settings={settings} />
        </Provider>
      ));
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

    const wrapper = mount((
      <Provider store={store}>
        <HtmlWidget settings={settings} navigate={navigate} />
      </Provider>
    ));

    expect(wrapper).toMatchSnapshot();
  });

  describe('Link handling', () => {
    it('follows a link from a plain <a>', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const settings = {
        defaultPadding: false,
        html: '&lt;a id=&quot;link&quot; href=&quot;#follow-me-and-everything-is-alright&quot;&gt;Plain Link&lt;/a&gt;',
      };

      const wrapper = mount(
        (
          <Provider store={store}>
            <HtmlWidget settings={settings} navigate={navigate} />
          </Provider>
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

      expect(navigate).toHaveBeenCalledTimes(1);
    });

    it('follows a link from a <a> with other HTML inside', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const settings = {
        defaultPadding: false,
        html: '&lt;a id=&quot;link&quot; href=&quot;#I-ll-be-the-one-to-tuck-you-in-at-night&quot;&gt;&lt;span&gt;Span Link&lt;/span&gt;&lt;/a&gt;',
      };

      const wrapper = mount(
        (
          <Provider store={store}>
            <HtmlWidget settings={settings} navigate={navigate} />
          </Provider>
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

      wrapper.find('HtmlWidget').instance().handleTap(event);

      expect(navigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Embedded media', () => {

  });
});
