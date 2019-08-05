import React from 'react';
import { mount } from 'enzyme';
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
    let renderedElement;
    it('should render', () => {
      renderedElement = mount((
        <I18n.Provider>
          <I18n.Text string="greeting">
            <I18n.Placeholder forKey="world">
              <strong>WORLD</strong>
            </I18n.Placeholder>
            /
          </I18n.Text>
        </I18n.Provider>
      ));
      expect(renderedElement).toMatchSnapshot();
    });

    it('should render with a placeholder text', () => {
      const text = renderedElement.find('strong').text();
      expect(text).toBe('WORLD');
    });
  });
});
