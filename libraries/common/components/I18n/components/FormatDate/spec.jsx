import React from 'react';
import { mount } from 'enzyme';
import { i18n } from '@shopgate/engage/core';
import I18n from '../../index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<FormatDate />', () => {
  const locales = {
    greeting: 'Hello {date}',
  };
  const lang = 'en-US';
  const timestamp = 123456789000;
  const formattedDate = 'Nov 29, 1973';
  const format = 'medium';

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
            <span className="only-date">
              <I18n.Date timestamp={timestamp} format={format} />
            </span>
            <span className="text-with-date">
              <I18n.Text string="greeting">
                <I18n.Date forKey="date" timestamp={timestamp} format={format} />
              </I18n.Text>
            </span>
          </div>
        </I18n.Provider>
      ));
      expect(renderedElement).toMatchSnapshot();
    });

    it('should render formatted date', () => {
      const text = renderedElement.find('.only-date').text();
      expect(text).toBe(formattedDate);
    });

    it('should render within translated text', () => {
      const text = renderedElement.find('.text-with-date').text();
      expect(text).toBe(`Hello ${formattedDate}`);
    });
  });
});
