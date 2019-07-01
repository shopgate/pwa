import React from 'react';
import { mount, shallow } from 'enzyme';
import Drawer from './index';

describe('<Drawer />', () => {
  const onOpen = jest.fn();
  const onClose = jest.fn();
  const onDidOpen = jest.fn();
  const onDidClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<Drawer />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should execute callback when drawer is opened', () => {
    const wrapper = mount(<Drawer onOpen={onOpen} />);
    wrapper.setProps({
      isOpen: true,
    });

    expect(onOpen).toBeCalled();
  });

  it('should execute callback when drawer is closed', () => {
    const wrapper = mount(<Drawer isOpen onClose={onClose} />);
    wrapper.setProps({
      isOpen: false,
    });

    expect(onClose).toBeCalled();
  });

  it('should add custom classes', () => {
    const wrapper = mount(<Drawer className="custom-class-name" isOpen />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.hasClass('custom-class-name')).toEqual(true);
  });

  it('should execute callback when drawer open animation did end', () => {
    const wrapper = mount(<Drawer className="custom-class-name" isOpen={false} onOpen={onOpen} onDidOpen={onDidOpen} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({
      isOpen: true,
    });

    expect(onOpen).toBeCalled();
    expect(onDidOpen).not.toBeCalled();
    wrapper.simulate('animationEnd');
    expect(onDidOpen).toBeCalled();
  });

  it('should execute callback when drawer close animation did end', () => {
    const wrapper = mount(<Drawer className="custom-class-name" isOpen onClose={onClose} onDidClose={onDidClose} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({
      isOpen: false,
    });

    expect(onClose).toBeCalled();
    expect(onDidClose).not.toBeCalled();
    wrapper.simulate('animationEnd');
    expect(onDidClose).toBeCalled();
  });
});
