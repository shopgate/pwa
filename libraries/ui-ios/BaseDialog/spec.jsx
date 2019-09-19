import React from 'react';
import { shallow } from 'enzyme';
import Title from './components/Title';
import Content from './components/Content';
import Buttons from './components/Buttons';
import BasicDialog from './index';

const props = {
  title: 'Hello World',
  children: <div>Hello World</div>,
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

describe('<BasicDialog />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<BasicDialog actions={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render as expected', () => {
    const wrapper = shallow(<BasicDialog {...props} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Title).length).toBe(1);
    expect(wrapper.find(Title).props().title).toEqual(props.title);
    expect(wrapper.find(Content).length).toBe(1);
    expect(wrapper.find(Content).props().content).toEqual(props.children);
    expect(wrapper.find(Buttons).length).toBe(1);
    expect(wrapper.find(Buttons).props().actions).toEqual(props.actions);
  });
});
