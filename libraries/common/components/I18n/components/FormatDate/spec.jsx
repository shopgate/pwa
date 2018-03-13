import React from 'react';
import { mount } from 'enzyme';
import I18n from '../../index';

describe('<FormatDate />', () => {
  let renderedElement;
  const testLocales = {
    greeting: 'Hello {date}',
  };
  const timestamp = 123456789000;
  const formattedDate = 'Nov 29, 1973';
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
