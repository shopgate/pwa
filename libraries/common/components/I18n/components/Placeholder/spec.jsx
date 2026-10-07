import { render, screen } from '@testing-library/react';
import { i18n } from '@shopgate/engage/core';
import I18n from '../../index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<Placeholder />', () => {
  const locales = {
    greeting: 'Hello {world}',
  };
  const lang = 'en-US';

  i18n.init({
    locales,
    lang,
  });

  describe('Given the component was mounted to the DOM', () => {
    beforeEach(() => {
      render((
        <I18n.Provider>
          <I18n.Text string="greeting">
            <I18n.Placeholder forKey="world">
              <strong>WORLD</strong>
            </I18n.Placeholder>
            /
          </I18n.Text>
        </I18n.Provider>
      ));
    });

    it('should render', () => {
      expect(screen.getByText('Hello', { exact: false }).outerHTML)
        .toBe('<span>Hello <strong>WORLD</strong>/</span>');
    });

    it('should render with a placeholder text', () => {
      const placeholder = screen.getByText('WORLD');

      expect(placeholder.tagName).toBe('STRONG');
    });
  });
});
