import React from 'react';
import { mount } from 'enzyme';
import { i18n } from '@shopgate/engage/core';
import I18n from '../../index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<FormatPrice />', () => {
  const locales = {
    greeting: 'Hello {price}',
  };
  const price = 1234.56;
  const formattedPrice = '€1,234.56';
  const currency = 'EUR';
  const lang = 'en-US';

  i18n.init({
    locales,
    lang,
  });

  describe('Given the component was mounted to the DOM', () => {
    let renderedElement;
    it('should match snapshot', () => {
      renderedElement = mount((
        <I18n.Provider>
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
