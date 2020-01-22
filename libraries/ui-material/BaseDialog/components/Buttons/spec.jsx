import React from 'react';
import { shallow } from 'enzyme';
import Button from '@shopgate/pwa-ui-shared/Button';
import Buttons from './index';

const actions = [
  {
    label: 'action0',
    action: jest.fn(),
  },
  {
    label: 'action1',
    action: jest.fn(),
  },
  {
    label: 'action2',
    action: jest.fn(),
  },
];

describe('<Buttons />', () => {
  it('should not render if no actions are passed', () => {
    const wrapper = shallow(<Buttons />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render buttons', () => {
    const wrapper = shallow(<Buttons actions={actions} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Button).length).toBe(actions.length);
  });
});
