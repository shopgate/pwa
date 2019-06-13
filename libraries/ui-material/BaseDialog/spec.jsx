import React from 'react';
import { shallow } from 'enzyme';
import Button from '@shopgate/pwa-ui-shared/Button';
import BasicDialog from './index';

describe('<BasicDialog />', () => {
  const props = {
    actions: [
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
    ],
  };

  it('should render with minimal props', () => {
    const wrapper = shallow(<BasicDialog actions={[]} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should show correct number of buttons', () => {
    const wrapper = shallow(<BasicDialog {...props} />);

    expect(wrapper).toMatchSnapshot();

    expect(wrapper.find(Button).length).toBe(props.actions.length);
  });

  it('should trigger correct actions', () => {
    const wrapper = shallow(<BasicDialog {...props} />);

    const button = wrapper.find(Button).at(1);
    button.simulate('click');

    expect(wrapper).toMatchSnapshot();
    expect(props.actions[0].action).not.toBeCalled();
    expect(props.actions[1].action).toBeCalled();
    expect(props.actions[2].action).not.toBeCalled();
  });

  it('should render with node as a title', () => {
    const wrapper = shallow(<BasicDialog title={<strong>My Title</strong>} />);
    expect(wrapper.find('strong').text()).toEqual('My Title');
  });
});
