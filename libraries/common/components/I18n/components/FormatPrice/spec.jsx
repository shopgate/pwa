import { render, screen } from '@testing-library/react';
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
    beforeEach(() => {
      render((
        <I18n.Provider>
          <div>
            <span data-testid="only-price">
              <I18n.Price price={price} currency={currency} />
            </span>
            <span data-testid="text-with-price">
              <I18n.Text string="greeting">
                <I18n.Price forKey="price" price={price} currency={currency} />
              </I18n.Text>
            </span>
          </div>
        </I18n.Provider>
      ));
    });

    it('should render the formatted price standalone and within translated text', () => {
      expect(screen.getByTestId('only-price').innerHTML).toBe(formattedPrice);
      expect(screen.getByTestId('text-with-price').innerHTML)
        .toBe(`<span>Hello ${formattedPrice}</span>`);
    });
  });
});
