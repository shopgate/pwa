/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import I18nProvider from './index';

describe('<I18nProvider />', () => {
  let renderedElement;
  let renderedInstance;
  const testLocales = {
    en: {
      greeting: 'Hello {name}',
    },
    de: {
      greeting: 'Guten Tag {name}',
    },
  };

  /**
   * Renders the component.
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = shallow(<I18nProvider {...props} />);
    renderedInstance = renderedElement.instance();
  };

  beforeEach(() => {
    renderComponent({
      lang: 'en_US',
      locales: testLocales.en,
    });
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should provide access to i18n via context', () => {
      const { i18n } = renderedInstance.getChildContext();
      expect(i18n).toEqual(renderedInstance.getI18nInstance);
    });

    it('should translate when calling an instance method', () => {
      const { __ } = renderedInstance.getI18nInstance();
      const translated = __('greeting', { name: 'Test' });
      expect(translated).toBe('Hello Test');
    });

    describe('Given the lang prop changes', () => {
      beforeEach(() => {
        renderedElement.setProps({
          lang: 'de_DE',
          locales: testLocales.de,
        });
      });

      it('should translate according to changed language', () => {
        const { __ } = renderedInstance.getI18nInstance();
        const translated = __('greeting', { name: 'Test' });
        expect(translated).toBe('Guten Tag Test');
      });
    });
  });
});
