/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import QuantityPicker from './index';

describe('<QuantityPicker />', () => {
  it('should have an amount of 1 by default', () => {
    const wrapper = mount(<QuantityPicker />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual(1);
  });

  it('should have an amount of 3 via prop', () => {
    const wrapper = mount(<QuantityPicker quantity={3} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual(3);
  });

  it('should fall back to its default of 1, if 0 is supplied', () => {
    const wrapper = mount(<QuantityPicker quantity={0} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual(1);
  });

  it('should reset the amount to 1 if set to lower than 0', () => {
    const wrapper = mount(<QuantityPicker quantity={-1} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').prop('value')).toEqual(1);
  });

  it('should fall back to the previous value when the last value was invalid', () => {
    const wrapper = mount(<QuantityPicker quantity={124} />);
    const input = wrapper.find('input');

    input.simulate('change', { target: { value: '124.5' } });

    expect(wrapper).toMatchSnapshot();
    expect(input.prop('value')).toBe(124);
  });

  describe('Given editMode prop is handled correctly', () => {
    let wrapper;
    let input;

    beforeEach(() => {
      wrapper = mount(
        <QuantityPicker />);

      input = wrapper.instance().input;

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

      wrapper = mount(
        <QuantityPicker quantity={2} onChange={onChangeMock} />
      );

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

      wrapper = mount(
        <QuantityPicker onToggleEditMode={onToggleEditModeMock} />);

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
