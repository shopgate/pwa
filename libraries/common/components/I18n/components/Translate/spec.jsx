import { render, screen } from '@testing-library/react';
import { i18n } from '@shopgate/engage/core';
import I18n from '../../index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<Translate />', () => {
  const locales = {
    greeting: 'Hello {name}',
  };

  i18n.init({
    locales,
    lang: 'en-US',
  });

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      render((
        <I18n.Provider>
          <I18n.Text string="greeting" params={{ name: 'Test' }} />
        </I18n.Provider>
      ));
    });

    it('should render the translated text in a span without attributes', () => {
      expect(screen.getByText('Hello Test').outerHTML).toBe('<span>Hello Test</span>');
    });
  });
});
