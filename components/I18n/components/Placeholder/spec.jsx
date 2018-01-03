/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import I18n from '../../index';

describe('<Placeholder />', () => {
  let renderedElement;
  const testLocales = {
    greeting: 'Hello {world}',
  };

  const langCode = 'en-US';

  /**
   * Renders the component.
   * @param {Object} props The component props.
   */
  const renderComponent = (props) => {
    renderedElement = mount((
      <I18n.Provider {...props}>
        <I18n.Text string="greeting">
          <I18n.Placeholder forKey="world">
            <strong>WORLD</strong>
          </I18n.Placeholder>
      / </I18n.Text>
      </I18n.Provider>
    ));
  };

  beforeEach(() => {
    renderComponent({
      lang: langCode,
      locales: testLocales,
    });
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should render', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should render with a placeholder text', () => {
      const text = renderedElement.find('strong').text();
      expect(text).toBe('WORLD');
    });

    it('should render the plain text if no placeholder is provided.', () => {
      const wrapper = mount((
        <I18n.Provider lang={langCode} locales={testLocales}>
          <I18n.Text string="greeting" params={{ world: 'WORLD' }} />
        </I18n.Provider>
      ));

      const text = wrapper.find('span').text();
      expect(text).toBe('Hello WORLD');
    });
  });
});
