/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import MessageBar from './index';
import styles from './style';

const MESSAGE1 = 'This is some information';
const MESSAGE2 = 'This is an error that happened here.';
const MESSAGE3 = 'This is just a warning. Nothing to freak out about.';

describe('<MessageBar />', () => {
  describe('General rendering', () => {
    it('should be empty if no messages have been set', () => {
      const wrapper = mount(<MessageBar />);
      expect(wrapper.find('div').at(1).length).toEqual(0);
    });

    it('should render a message as info if type is missing', () => {
      const wrapper = mount(<MessageBar messages={[{ message: 'something' }]} />);

      expect(wrapper.find(`.${styles.container}`).childAt(0).props().className.trim()).toEqual(styles.info);
    });
  });

  describe('Multiple messages rendering', () => {
    const wrapper = mount(
      <MessageBar
        messages={[
          {
            message: MESSAGE1,
          },
          {
            type: 'error',
            message: MESSAGE2,
          },
          {
            type: 'warning',
            message: MESSAGE3,
          },
        ]}
      />
    );

    const messageContainer = wrapper.find(`.${styles.container}`);

    it('should render 3 messages', () => {
      expect(messageContainer.children().length).toEqual(3);
    });

    it(`should have the first child as info with the content of "${MESSAGE1}"`, () => {
      expect(messageContainer.childAt(0).props().className.trim()).toEqual(styles.info);
      expect(messageContainer.childAt(0).props().children).toEqual(MESSAGE1);
    });

    it(`should have a second child as error with the content of "${MESSAGE2}"`, () => {
      expect(messageContainer.childAt(1).props().className.trim()).toEqual(styles.error);
      expect(messageContainer.childAt(1).props().children).toEqual(MESSAGE2);
    });

    it(`should have a third child as error with the content of "${MESSAGE3}"`, () => {
      expect(messageContainer.childAt(2).props().className.trim()).toEqual(styles.warning);
      expect(messageContainer.childAt(2).props().children).toEqual(MESSAGE3);
    });
  });
});
