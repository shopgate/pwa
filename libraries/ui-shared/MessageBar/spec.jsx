import React from 'react';
import { mount } from 'enzyme';
import MessageBar from './index';

const MESSAGE1 = 'This is some information';
const MESSAGE2 = 'This is an error that happened here.';
const MESSAGE3 = 'This is just a warning. Nothing to freak out about.';

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
    const wrapper = mount(<MessageBar
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
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
