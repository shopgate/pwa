import { render, screen } from '@testing-library/react';
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
    beforeEach(() => {
      render((
        <I18n.Provider>
          <div>
            <span data-testid="only-date">
              <I18n.Date timestamp={timestamp} format={format} />
            </span>
            <span data-testid="text-with-date">
              <I18n.Text string="greeting">
                <I18n.Date forKey="date" timestamp={timestamp} format={format} />
              </I18n.Text>
            </span>
          </div>
        </I18n.Provider>
      ));
    });

    it('should render the formatted date standalone and within translated text', () => {
      expect(screen.getByTestId('only-date').innerHTML).toBe(formattedDate);
      expect(screen.getByTestId('text-with-date').innerHTML)
        .toBe(`<span>Hello ${formattedDate}</span>`);
    });
  });
});
