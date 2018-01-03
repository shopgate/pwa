/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import I18n from '../../index';

describe('<Translate />', () => {
  let renderedElement;
  const testLocales = {
    greeting: 'Hello {name}',
  };

  /**
   * Renders the component.
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = mount((
      <I18n.Provider {...props}>
        <I18n.Text string="greeting" params={{ name: 'Test' }} />
      </I18n.Provider>
    ));
  };

  beforeEach(() => {
    renderComponent({
      lang: 'en-US',
      locales: testLocales,
    });
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should render translated text', () => {
      const text = renderedElement.find(I18n.Text).text();
      expect(text).toBe('Hello Test');
    });
  });
});
