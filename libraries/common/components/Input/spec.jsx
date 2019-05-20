import React from 'react';
import { mount, shallow } from 'enzyme';
import Input from './index';

describe('<Input />', () => {
  it('should render a simple input field', () => {
    const wrapper = mount(<Input />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').length).toBe(1);
  });

  it('should render the input as password', () => {
    const wrapper = mount(<Input password />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input[type="password"]').length).toBe(1);
  });

  it('should render the input with a default value', () => {
    const wrapper = mount(<Input value="FooBar" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input[value="FooBar"]').length).toBe(1);
  });

  it('should trigger the onChange callback', () => {
    const onChangeMock = jest.fn();

    const wrapper = mount(<Input onChange={onChangeMock} />);

    wrapper.find('input').simulate('change', { target: { value: 'a' } });

    expect(wrapper).toMatchSnapshot();
    expect(onChangeMock.mock.calls.length).toBe(2);
  });

  it('should receive the correct value while typing', () => {
    const wrapper = mount(<Input />);

    const input = wrapper.find('input');

    input.simulate('change', { target: { value: 'foobar' } });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SimpleInput').instance().value).toBe('foobar');
  });

  it('should sanitize the input', () => {
    const wrapper = mount(<Input onSanitize={value => value.toUpperCase()} />);

    const input = wrapper.find('input');

    input.simulate('change', { target: { value: 'foobar' } });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SimpleInput').instance().value).toBe('FOOBAR');
  });

  it('should validate the input', () => {
    const wrapper = mount(<Input onValidate={() => false} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SimpleInput').instance().isValid).toBe(false);
  });

  it('should focus the input', () => {
    const onFocusMock = jest.fn();

    const wrapper = mount(<Input onFocusChange={onFocusMock} />);

    const input = wrapper.find('input');

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SimpleInput').instance().isFocused).toBe(false);

    input.simulate('focus');

    expect(wrapper.find('SimpleInput').instance().isFocused).toBe(true);

    input.simulate('blur');
    expect(wrapper.find('SimpleInput').instance().isFocused).toBe(false);
  });

  it('should change the value on user input', () => {
    const wrapper = mount(<Input value="My initial value" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('SimpleInput').instance().value).toBe('My initial value');

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'foobar' } });

    expect(wrapper.find('SimpleInput').instance().value).toBe('foobar');
  });

  it('should render a multiline input with empty content and react on change', () => {
    const multiLineValue = `dfsdsdf
    sdfdsff
    dsf`;
    const wrapper = mount(<Input value="" multiLine />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('MultiLineInput').instance().value).toEqual('');
    wrapper.setProps({ value: multiLineValue });
    expect(wrapper.find('textarea').getDOMNode().innerHTML).toEqual(multiLineValue);
  });

  it('should render additional html attributes', () => {
    const wrapper = shallow((
      <Input
        type="date"
        attributes={{
          min: '1970-01-01',
          max: '2010-01-01',
        }}
      />
    )).dive();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.prop('min')).toEqual('1970-01-01');
    expect(wrapper.prop('max')).toEqual('2010-01-01');
  });
});
