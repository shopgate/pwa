/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
// TODO import { JSDOM } from 'jsdom';
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

describe.skip('<HtmlWidget />', () => {
  it('should render the HtmlWidget', () => {
    const settings = {
      // The value for html is the HTML-escaped equivalent of the following:
      // <h1>Hello World!</h1>
      html: '&lt;h1&gt;Hello World!&lt;/h1&gt;',
    };

    const wrapper = shallow(
      <HtmlWidget settings={settings} />
    );

    // Test result of dangerouslySetInnerHTML.
    expect(wrapper.html()).toEqual('<div><h1>Hello World!</h1></div>');
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('strips out the script tags', () => {
    const settings = {
      // The value for html is the HTML-escaped equivalent of the following:
      // <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
      // <script type="text/javascript">var x = 42;</script>
      // <p>Foo Bar</p>
      // <script>var y = 23;</script>
      html: '&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js&quot;&gt;&lt;/script&gt; &lt;script type=&quot;text/javascript&quot;&gt;var x = 42;&lt;/script&gt; &lt;p&gt;Foo Bar&lt;/p&gt; &lt;script&gt;var y = 23;&lt;/script&gt;',
    };

    const wrapper = shallow(
      <HtmlWidget settings={settings} />
    );

    // Test result of dangerouslySetInnerHTML.
    expect(wrapper.html()).toEqual('<div><p>Foo Bar</p> </div>');
    expect(wrapper).toMatchSnapshot();
  });

  describe('Link handling', () => {
    beforeEach(() => {
      mockConstructor.mockClear();
    });

    it('follows a link from a plain <a>', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const settings = {
        html: '&lt;a id=&quot;link&quot; href=&quot;#follow-me-and-everything-is-alright&quot;&gt;Plain Link&lt;/a&gt;',
      };
      const wrapper = mount(
        <HtmlWidget settings={settings} />, {
          attachTo: doc.getElementsByTagName('div')[0],
        });

      const aTag = doc.getElementsByTagName('a')[0];
      aTag.closest = () => aTag;
      const event = { target: aTag, preventDefault: () => {} };
      wrapper.instance().handleTap(event);

      expect(mockConstructor).toHaveBeenCalledTimes(1);
    });

    it('follows a link from a <a> with other HTML inside', () => {
      const doc = new JSDOM('<!doctype html><html><body><div>/<div></body></html>').window.document;

      const settings = {
        html: '&lt;a id=&quot;link&quot; href=&quot;#I-ll-be-the-one-to-tuck-you-in-at-night&quot;&gt;&lt;span&gt;Span Link&lt;/span&gt;&lt;/a&gt;',
      };
      const wrapper = mount(
        <HtmlWidget settings={settings} />, {
          attachTo: doc.getElementsByTagName('div')[0],
        });

      const aTag = doc.getElementsByTagName('a')[0];
      const spanTag = doc.getElementsByTagName('span')[0];
      spanTag.closest = () => aTag;
      const event = { target: spanTag, preventDefault: () => {} };
      wrapper.instance().handleTap(event);

      expect(mockConstructor).toHaveBeenCalledTimes(1);
    });
  });
});
