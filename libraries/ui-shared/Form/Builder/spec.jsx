import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FormBuilder from '.';

configure({ adapter: new Adapter() });

describe('<FormBuilder />', () => {
  it('should render empty form', () => {
    const wrapper = mount((
      <FormBuilder
        config={{
          fields: {
          },
        }}
        name="foo"
        handleUpdate={() => {}}
      />
    ));

    expect(wrapper).toMatchSnapshot();
  });

  it('should render two text fields', () => {
    const wrapper = mount((
      <FormBuilder
        config={{
          fields: {
            firstName: {
              label: 'foo',
              type: 'text',
              visible: true,
            },
            lastName: {
              label: 'bar',
              type: 'text',
              visible: true,
            },
          },
        }}
        name="foo"
        handleUpdate={() => {}}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextField').length).toEqual(2);
  });

  it('should not render invisible field', () => {
    const wrapper = mount((
      <FormBuilder
        config={{
          fields: {
            firstName: {
              label: 'foo',
              type: 'text',
              visible: false,
            },
          },
        }}
        name="foo"
        handleUpdate={() => {}}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextField').length).toEqual(0);
  });

  it('should hide element if setVisibilty rule applies', () => {
    const wrapper = mount((
      <FormBuilder
        config={{
          fields: {
            foo: {
              label: 'foo',
              type: 'text',
              visible: true,
            },
            bar: {
              label: 'bar',
              type: 'text',
              actions: [{
                type: 'setVisibility',
                rules: [{
                  context: 'foo',
                  type: 'notIn',
                  data: ['abc'],
                }],
              }],
            },
          },
        }}
        name="foo"
        handleUpdate={() => {}}
      />
    ));

    // Both should be visible at the beginning.
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextField').length).toEqual(2);

    // Simulate user input to the text field.
    wrapper.find('input').first().simulate('change', { target: { value: 'abc' } });

    // Second field should be hidden now.
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextField').length).toEqual(1);
  });

  it('should reset value when rule applies', () => {
    const wrapper = mount((
      <FormBuilder
        config={{
          fields: {
            foo: {
              label: 'foo',
              type: 'text',
              visible: true,
              default: 'default',
            },
            bar: {
              label: 'bar',
              type: 'text',
              default: 'default',
              actions: [{
                type: 'setValue',
                params: {
                  value: 'cheat',
                  type: 'fixed',
                },
                rules: [{
                  context: 'foo',
                  type: 'notIn',
                  data: ['default'],
                }],
              }],
            },
          },
        }}
        name="foo"
        handleUpdate={() => {}}
      />
    ));

    // Default values should be in the inputs.
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextField').length).toEqual(2);
    expect(wrapper.find('input').at(0).props().value).toEqual('default');
    expect(wrapper.find('input').at(1).props().value).toEqual('default');

    // Simulate text input to trigger rule.
    wrapper.find('input').first().simulate('change', { target: { value: 'abc' } });
    wrapper.update();

    // Second field should be hidden now.
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('TextField').length).toEqual(2);
    expect(wrapper.find('input').at(0).props().value).toEqual('abc');
    expect(wrapper.find('input').at(1).props().value).toEqual('cheat');
  });

  it('should call onChange callback when input is changed', () => {
    const handleUpdate = jest.fn();
    const wrapper = mount((
      <FormBuilder
        config={{
          fields: {
            foo: {
              label: 'foo',
              type: 'text',
              visible: true,
              default: 'default',
            },
          },
        }}
        name="foo"
        id="foo"
        handleUpdate={handleUpdate}
      />
    ));

    // Should call with initial state.
    expect(wrapper).toMatchSnapshot();
    expect(handleUpdate).toHaveBeenCalledWith({ foo: 'default' }, false);
    handleUpdate.mockClear();

    // Update input
    wrapper.find('input').first().simulate('change', { target: { value: 'abc' } });

    // Should call with updated state.
    expect(handleUpdate).toHaveBeenCalledWith({ foo: 'abc' }, false);
  });
});
