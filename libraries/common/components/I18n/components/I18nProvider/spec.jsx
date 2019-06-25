import React from 'react';
import { shallow } from 'enzyme';
import { i18n as i18nHelper } from '@shopgate/engage/core';
import I18nProvider from './index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<I18nProvider />', () => {
  const locales = {
    greeting: 'Guten Tag {name}',
  };
  const lang = 'de-DE';

  i18nHelper.init({
    locales,
    lang,
  });

  describe('Given the component was mounted to the DOM', () => {
    let renderedElement;
    let renderedInstance;
    it('should match snapshot', () => {
      renderedElement = shallow(<I18nProvider />);
      renderedInstance = renderedElement.instance();
      expect(renderedElement).toMatchSnapshot();
    });

    it('should provide access to i18n via context', () => {
      const { i18n } = renderedInstance.getChildContext();
      expect(i18n).toEqual(renderedInstance.getI18nInstance);
    });

    it('should translate when calling an instance method', () => {
      const { __ } = renderedInstance.getI18nInstance();
      const translated = __('greeting', { name: 'Test' });
      expect(translated).toBe('Guten Tag Test');
    });
  });
});
