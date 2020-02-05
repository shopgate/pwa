import React from 'react';
import { mount } from 'enzyme';
import TextField from './index';

const inputProps = {
  name: 'test-input',
};

describe('<TextField>', () => {
  it('should render a simple text field', () => {
    const wrapper = mount(<TextField {...inputProps} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input').length).toBe(1);
  });

  it('should render the text field as password', () => {
    const wrapper = mount(<TextField {...inputProps} password />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input[type="password"]').length).toBe(1);
  });

  it('should render the text field with a default value', () => {
    const wrapper = mount(<TextField {...inputProps} value="FooBar" />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input[value="FooBar"]').length).toBe(1);
  });

  it('should trigger the onChange callback', () => {
    const onChangeMock = jest.fn();

    const wrapper = mount(<TextField {...inputProps} onChange={onChangeMock} />);

    wrapper.find('input').simulate('change', { target: { value: 'a' } });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(wrapper.find('input').props().value).toEqual('a');
  });

  it('should receive the correct value while typing', () => {
    const wrapper = mount(<TextField {...inputProps} />);
    const input = wrapper.find('input');

    input.simulate('change', { target: { value: 'foobar' } });
    expect(wrapper).toMatchSnapshot();
    expect(input.instance().value).toBe('foobar');
  });

  it('should sanitize the input', () => {
    const wrapper = mount(<TextField
      {...inputProps}
      onSanitize={value => value.toUpperCase()}
    />);

    const input = wrapper.find('input');

    input.simulate('change', { target: { value: 'foobar' } });

    expect(wrapper).toMatchSnapshot();
    expect(input.instance().value).toBe('FOOBAR');
  });

  it('should trigger the validation callback', () => {
    const onValidateMock = jest.fn();

    const wrapper = mount(<TextField {...inputProps} onValidate={onValidateMock} />);

    expect(wrapper).toMatchSnapshot();
    expect(onValidateMock).toHaveBeenCalled();
  });

  it('should focus the input', () => {
    const onFocusMock = jest.fn();

    const wrapper = mount(<TextField {...inputProps} onFocusChange={onFocusMock} />);

    const input = wrapper.find('SimpleInput');

    expect(wrapper).toMatchSnapshot();
    expect(input.instance().isFocused).toBe(false);

    input.simulate('focus');

    expect(input.instance().isFocused).toBe(true);

    input.simulate('blur');
    expect(input.instance().isFocused).toBe(false);
  });

  it('should show the error message', () => {
    const errorText = 'This is an error here';

    const wrapper = mount(<TextField {...inputProps} errorText={errorText} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('ErrorText').find('Translate').at(0).props().string).toEqual(errorText);
  });

  it('should show the label', () => {
    const label = 'This is the label';

    const wrapper = mount(<TextField {...inputProps} label={label} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Label').find('Translate').props().string).toEqual(label);
  });

  it('should show the placeholder text', () => {
    const placeholder = 'This is the placeholder text';

    const wrapper = mount(<TextField {...inputProps} placeholder={placeholder} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Placeholder').find('Translate').at(0).props().string).toEqual(placeholder);
  });
});
