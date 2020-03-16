import React from 'react';
import { mount } from 'enzyme';
import { MessageBar } from '../index';

const MESSAGE1 = 'This is some information';
const MESSAGE2 = 'This is an error that happened here.';
const MESSAGE3 = 'This is just a warning. Nothing to freak out about.';
const MESSAGE4 = 'Normal pre-translated message.';
const MESSAGE5 = 'Normal pre-translated message.';
const MESSAGE6 = 'some.translation.string';
const MESSAGE7 = 'Message with messageParams';

describe('<MessageBar />', () => {
  describe('General rendering', () => {
    it('should be empty if no messages have been set', () => {
      const wrapper = mount(<MessageBar messages={[]} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render a message as info if type is missing', () => {
      const wrapper = mount(<MessageBar messages={[{ message: 'something' }]} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Multiple messages rendering', () => {
    it('should render messages without frontend translation', () => {
      const wrapper = mount(<MessageBar
        messages={[
          {
            type: 'info',
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
          {
            message: MESSAGE4,
            translated: null,
          },
          {
            message: MESSAGE5,
            translated: true,
          },
        ]}
      />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should translate and render all given messages', () => {
      const wrapper = mount(<MessageBar
        messages={[
          {
            message: MESSAGE6,
            translated: false,
          },
          {
            message: MESSAGE7,
            messageParams: {
              myCustomParam1: '-> TEST-VALUE #1 <-',
              myCustomParam2: '-> TEST-VALUE #2 <-',
            },
            translated: false,
          },
        ]}
      />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
