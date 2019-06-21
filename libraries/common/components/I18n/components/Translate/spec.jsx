import React from 'react';
import { mount } from 'enzyme';
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
    let renderedElement;

    it('should match snapshot', () => {
      renderedElement = mount((
        <I18n.Provider>
          <I18n.Text string="greeting" params={{ name: 'Test' }} />
        </I18n.Provider>
      ));
      expect(renderedElement).toMatchSnapshot();
    });

    it('should render translated text', () => {
      const text = renderedElement.find(I18n.Text).text();
      expect(text).toBe('Hello Test');
    });
  });
});
