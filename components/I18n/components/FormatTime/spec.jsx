/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import I18n from '../../index';

describe.skip('<FormatTime />', () => {
  let renderedElement;
  const testLocales = {
    greeting: 'Hello {time}',
  };
  const timestamp = new Date('Dec 25, 1999 04:25:45').getTime();
  const formattedTime = '4:25:45 AM';
  const format = 'medium';
  const langCode = 'en-US';

  /**
   * Renders the component.
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = mount((
      <I18n.Provider {...props}>
        <div>
          <span className="only-time">
            <I18n.Time timestamp={timestamp} format={format} />
          </span>
          <span className="text-with-time">
            <I18n.Text string="greeting">
              <I18n.Time forKey="time" timestamp={timestamp} format={format} />
            </I18n.Text>
          </span>
        </div>
      </I18n.Provider>
    ));
  };

  beforeEach(() => {
    renderComponent({
      lang: langCode,
      locales: testLocales,
    });
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should render formatted time', () => {
      const text = renderedElement.find('.only-time').text();
      expect(text).toBe(formattedTime);
    });

    it('should render within translated text', () => {
      const text = renderedElement.find('.text-with-time').text();
      expect(text).toBe(`Hello ${formattedTime}`);
    });
  });
});
