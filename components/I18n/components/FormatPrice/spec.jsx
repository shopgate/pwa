/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import I18n from '../../index';

describe('<FormatPrice />', () => {
  let renderedElement;
  const testLocales = {
    greeting: 'Hello {price}',
  };
  const price = 1234.56;
  const formattedPrice = '€1,234.56';
  const currency = 'EUR';
  const langCode = 'en-US';

  /**
   * Renders the component.
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = mount((
      <I18n.Provider {...props}>
        <div>
          <span className="only-price">
            <I18n.Price price={price} currency={currency} />
          </span>
          <span className="text-with-price">
            <I18n.Text string="greeting">
              <I18n.Price forKey="price" price={price} currency={currency} />
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

    it('should render formatted price', () => {
      const text = renderedElement.find('.only-price').text();
      expect(text).toBe(formattedPrice);
    });

    it('should render within translated text', () => {
      const text = renderedElement.find('.text-with-price').text();
      expect(text).toBe(`Hello ${formattedPrice}`);
    });
  });
});
