import React from 'react';
import { shallow, mount } from 'enzyme';
import Checkbox from './index';

/**
 * Checked Icon
 * @returns {JSX}
 */
const Checked = () => <div />;

/**
 * Unchecked Icon
 * @returns {JSX}
 */
const Unchecked = () => <div />;

describe('<Checkbox />', () => {
  it('should render the checkbox with the label before the icon', () => {
    const wrapper = shallow((
      <Checkbox
        label={<span>Test Label Deluxe</span>}
        labelPosition="left"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        checked={false}
      />
    ));

    const expected = (
      <div>
        <span>Test Label Deluxe</span>
        <Unchecked />
      </div>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.matchesElement(expected)).toBeTruthy();
  });

  it('should render the checkbox with the label after the icon', () => {
    const wrapper = shallow((
      <Checkbox
        label={<span>Test Label Deluxe</span>}
        labelPosition="right"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        checked={false}
      />
    ));

    const expected = (
      <div>
        <Unchecked />
        <span>Test Label Deluxe</span>
      </div>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.matchesElement(expected)).toBeTruthy();
  });

  it('should render the unchecked icon if "checked" is false', () => {
    const wrapper = shallow((
      <Checkbox
        checked={false}
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Checked).length).toBe(0);
    expect(wrapper.find(Unchecked).length).toBe(1);
  });

  it('should render the unchecked icon if "checked" is false', () => {
    const wrapper = shallow((
      <Checkbox
        checked
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Checked).length).toBe(1);
    expect(wrapper.find(Unchecked).length).toBe(0);
  });

  it('should call the callback with the inverted value', () => {
    const spy = jest.fn();

    const wrapper = shallow((
      <Checkbox
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        checked={false}
        onCheck={spy}
      />
    ));

    wrapper.simulate('click');
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should render an <input> element if a name prop is provided', () => {
    const wrapper = shallow((
      <Checkbox
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        defaultChecked={false}
        name="myCheckbox"
      />
    ));

    const input = wrapper.find('input');
    expect(input.length).toBe(1);
    expect(input.prop('name')).toEqual('myCheckbox');
    expect(input.prop('value')).toEqual(0);
  });

  it('should work as an uncontrolled input', () => {
    const wrapper = mount((
      <Checkbox
        label="Test Label Deluxe"
        checkedIcon={<Checked />}
        uncheckedIcon={<Unchecked />}
        defaultChecked={false}
        name="myCheckbox"
      />
    ));

    expect(wrapper.find('input').prop('value')).toEqual(0);
    wrapper.simulate('click');
    expect(wrapper.find('input').prop('value')).toEqual(1);
  });
});
