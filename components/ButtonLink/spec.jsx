/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { mount } from 'enzyme';
import ParsedMockLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link/index.mock';
import ActionButton from '../ActionButton';
import ButtonLink from './index';

const mockedParsedLink = new ParsedMockLink('http://example.com');
jest.mock(
  '@shopgate/pwa-common/components/Router/helpers/parsed-link',
  () => () => mockedParsedLink
);

describe('<ButtonLink>', () => {
  describe('On click action', () => {
    const originalActionButtonClickDelay = ActionButton.clickDelay;
    beforeAll(() => {
      ActionButton.clickDelay = 0;
    });
    afterAll(() => {
      ActionButton.clickDelay = originalActionButtonClickDelay;
    });
    it('should create component and open page on click', (done) => {
      const component = mount(
        <ButtonLink href="https://example.com">
          Text inside
        </ButtonLink>
      );
      expect(component).toMatchSnapshot();
      expect(mockedParsedLink.openFunctionMock.mock.calls.length).toBe(0);
      component.find('RippleButton').simulate('click');
      component.update();
      setTimeout(() => {
        expect(mockedParsedLink.openFunctionMock.mock.calls.length).toBe(1);
        done();
      }, ActionButton.clickDelay + 1);
    });
  });
});
