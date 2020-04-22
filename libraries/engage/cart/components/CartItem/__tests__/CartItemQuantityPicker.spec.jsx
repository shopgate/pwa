import React from 'react';
import { mount } from 'enzyme';
import { CartItemQuantityPicker } from '../CartItemQuantityPicker';

describe('<CartItemQuantityPicker />', () => {
  it('should have an amount of 1 by default', () => {
    const wrapper = mount(<CartItemQuantityPicker />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual('1');
  });

  it('should have an amount of 3 via prop', () => {
    const wrapper = mount(<CartItemQuantityPicker quantity={3} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual('3');
  });

  it('should have an mount of 0, if 0 is supplied', () => {
    const wrapper = mount(<CartItemQuantityPicker quantity={0} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual('0');
  });

  it.skip('should reset the amount to 1 if set to lower than 0', () => {
    const wrapper = mount(<CartItemQuantityPicker quantity={-1} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual(1);
  });

  it.skip('should fall back to the previous value when the last value was invalid', () => {
    const wrapper = mount(<CartItemQuantityPicker quantity={124} />);
    const input = wrapper.find('input');

    input.simulate('change', { target: { value: '124.5' } });

    expect(wrapper).toMatchSnapshot();
    expect(input.prop('value')).toBe(124);
  });

  describe('Given editMode prop is handled correctly', () => {
    let wrapper;
    let input;

    beforeEach(() => {
      wrapper = mount(<CartItemQuantityPicker />);

      input = wrapper.instance().input.current;
      jest.spyOn(input, 'focus');
      jest.spyOn(input, 'blur');
    });

    it('should focus the input, if the editMode is enabled via prop', () => {
      wrapper.setProps({
        editMode: true,
      });

      expect(wrapper).toMatchSnapshot();
      expect(input.focus).toHaveBeenCalled();
    });

    it('should blur the input, if the editMode is disabled via prop', () => {
      wrapper.setProps({
        editMode: false,
      });

      expect(wrapper).toMatchSnapshot();
      expect(input.blur).toHaveBeenCalled();
    });
  });

  describe('Given onChange callback is triggered correctly', () => {
    let wrapper;
    let input;
    let onChangeMock;

    beforeEach(() => {
      onChangeMock = jest.fn();

      wrapper = mount(<CartItemQuantityPicker quantity={2} onChange={onChangeMock} />);

      input = wrapper.find('input');
    });

    it('should trigger the callback when the input changed', () => {
      input.simulate('focus');
      input.simulate('change', { target: { value: '123' } });
      input.simulate('blur');

      expect(wrapper).toMatchSnapshot();
      expect(onChangeMock.mock.calls.length).toBe(1);
    });

    it('should not trigger the callback when the input didn\'t change', () => {
      input.simulate('focus');
      input.simulate('change', { target: { value: '2' } });
      input.simulate('blur');

      expect(wrapper).toMatchSnapshot();
      expect(onChangeMock.mock.calls.length).toBe(0);
    });
  });

  describe('Given onToggleEditMode callback is triggered correctly', () => {
    let wrapper;
    let input;
    let onToggleEditModeMock;

    beforeEach(() => {
      onToggleEditModeMock = jest.fn();

      wrapper = mount(<CartItemQuantityPicker onToggleEditMode={onToggleEditModeMock} />);

      input = wrapper.find('input');
    });

    it('should trigger the callback when the input was focused', () => {
      input.simulate('focus');

      expect(wrapper).toMatchSnapshot();
      expect(onToggleEditModeMock).lastCalledWith(true);
    });

    it('should trigger the callback when the input was blurred', () => {
      input.simulate('focus');
      input.simulate('blur');

      expect(wrapper).toMatchSnapshot();
      expect(onToggleEditModeMock).lastCalledWith(false);
    });
  });
});
