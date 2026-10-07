import { render, screen } from '@testing-library/react';
import { i18n } from '@shopgate/engage/core';
import I18n from '../../index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<FormatTime />', () => {
  const locales = {
    greeting: 'Hello {time}',
  };
  const timestamp = new Date('Dec 25, 1999 04:25:45').getTime();
  const formattedTime = '4:25:45 AM';
  const format = 'medium';
  const lang = 'en-US';

  i18n.init({
    locales,
    lang,
  });

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      render((
        <I18n.Provider>
          <div>
            <span data-testid="only-time">
              <I18n.Time timestamp={timestamp} format={format} />
            </span>
            <span data-testid="text-with-time">
              <I18n.Text string="greeting">
                <I18n.Time forKey="time" timestamp={timestamp} format={format} />
              </I18n.Text>
            </span>
          </div>
        </I18n.Provider>
      ));
    });

    it('should render formatted time', () => {
      expect(screen.getByTestId('only-time').textContent).toBe(formattedTime);
    });

    it('should render within translated text', () => {
      expect(screen.getByTestId('text-with-time').textContent).toBe(`Hello ${formattedTime}`);
    });
  });
});
