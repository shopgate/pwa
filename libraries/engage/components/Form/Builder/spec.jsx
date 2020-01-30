/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import { mount } from 'enzyme';
import { Builder } from '.';

describe('<Builder />', () => {
  it('should render empty form', () => {
    const wrapper = mount((
      <Builder
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
      <Builder
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
      <Builder
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
      <Builder
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
      <Builder
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
      <Builder
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

  describe('Builder::elementChangeHandler', () => {
    it('should take the updated state from action listener', () => {
      // Create mocked Form builder.
      const handleUpdate = jest.fn();
      const builder = new Builder({
        validationErrors: [],
        config: {
          fields: {
            foo: {
              label: 'foo',
              type: 'text',
              visible: true,
              default: 'default',
            },
          },
        },
        handleUpdate,
      });
      builder.actionListener.notify = () => ({
        formData: {
          foo: 'bar',
        },
        errors: {},
        elementVisibility: {
          foo: true,
        },
      });

      // Trigger update
      builder.elementChangeHandler('foo', 'bar');

      // Test
      expect(handleUpdate).toHaveBeenCalledWith({
        foo: 'bar',
      }, false);
    });

    it('should consider backend validations', () => {
      // Create mocked Form builder.
      const handleUpdate = jest.fn();
      const builder = new Builder({
        validationErrors: [{}],
        config: {
          fields: {
            foo: {
              label: 'foo',
              type: 'text',
              visible: true,
              default: 'default',
            },
          },
        },
        handleUpdate,
      });
      builder.actionListener.notify = () => ({
        formData: {
          foo: 'bar',
        },
        errors: {},
        elementVisibility: {
          foo: true,
        },
      });

      // Trigger update
      builder.elementChangeHandler('foo', 'bar');

      // Test
      expect(handleUpdate).toHaveBeenCalledWith({
        foo: 'bar',
      }, true);
    });
  });

  describe('Builder::elementSortFunc', () => {
    const builder = new Builder({
      validationErrors: [{}],
      config: { fields: {} },
      handleUpdate: jest.fn(),
    });

    const field1 = { id: 'foo', label: 'foo' };
    const field2 = { id: 'foo2', label: 'foo2' };

    it('should keep sortOrder for undefined', () => {
      expect([field2, field1].sort(builder.elementSortFunc)).toEqual([field2, field1]);
    });
    it('should sort elements', () => {
      const fields = [{ ...field1, sortOrder: 2 }, { ...field2, sortOrder: 1 }];
      expect(fields.sort(builder.elementSortFunc)).toEqual(fields.reverse());
    });
    it('should keep sortOrder', () => {
      const fields = [{ ...field2, sortOrder: 1 }, { ...field1, sortOrder: 2 }];
      expect(fields.sort(builder.elementSortFunc)).toEqual([...fields]);
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
