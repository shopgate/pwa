/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Builder } from '.';

jest.mock('@shopgate/engage/components');

describe('<Builder />', () => {
  it('should render empty form', () => {
    const { container } = render((
      <Builder
        config={{
          fields: {
          },
        }}
        name="foo"
        handleUpdate={() => { }}
      />
    ));

    expect(container.querySelectorAll('input')).toHaveLength(0);
  });

  it('should render two text fields', () => {
    const { container } = render((
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
        handleUpdate={() => { }}
      />
    ));

    expect(container.querySelectorAll('input')).toHaveLength(2);
  });

  it('should render invisible field with visibility prop set to false', () => {
    const { container } = render((
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
        handleUpdate={() => { }}
      />
    ));

    // The TextField component is hidden by the ElementText component
    expect(container.querySelectorAll('input')).toHaveLength(0);
  });

  it('should modify the element visibility if setVisibilty rule applies', () => {
    const { container } = render((
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
        handleUpdate={() => { }}
      />
    ));

    // Both should be marked visible at the beginning.
    expect(container.querySelectorAll('input')).toHaveLength(2);

    // Simulate user input to the text field.
    fireEvent.change(container.querySelectorAll('input')[0], { target: { value: 'abc' } });

    // Second field should be marked as hidden but be still rendered.
    // The TextField component is only rendered when the ElementText is visible.
    expect(container.querySelectorAll('input')).toHaveLength(1);
  });

  it('should reset value when rule applies', () => {
    const { container } = render((
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
        handleUpdate={() => { }}
      />
    ));

    // Default values should be in the inputs.
    expect(container.querySelectorAll('input')).toHaveLength(2);
    expect(container.querySelectorAll('input')[0].value).toEqual('default');
    expect(container.querySelectorAll('input')[1].value).toEqual('default');

    // Simulate text input to trigger rule.
    fireEvent.change(container.querySelectorAll('input')[0], { target: { value: 'abc' } });

    // Second field should be hidden now.
    expect(container.querySelectorAll('input')).toHaveLength(2);
    expect(container.querySelectorAll('input')[0].value).toEqual('abc');
    expect(container.querySelectorAll('input')[1].value).toEqual('cheat');
  });

  it('should call onChange callback when input is changed', () => {
    const handleUpdate = jest.fn();
    const { container } = render((
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
    expect(handleUpdate).toHaveBeenCalledWith({ foo: 'default' }, false, []);
    handleUpdate.mockClear();

    // Update input
    fireEvent.change(container.querySelectorAll('input')[0], { target: { value: 'abc' } });

    // Should call with updated state.
    expect(handleUpdate).toHaveBeenCalledWith({ foo: 'abc' }, false, []);
  });

  describe('Builder::elementChangeHandler', () => {
    it('should take the updated state from action listener', () => {
      // Create mocked Form builder.
      const handleUpdate = jest.fn();
      const ref = React.createRef();
      render((
        <Builder
          ref={ref}
          validationErrors={[]}
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

      ref.current.actionListener.notify = () => ({
        formData: {
          foo: 'bar',
        },
        validationErrors: {},
        elementVisibility: {
          foo: true,
        },
      });

      // Trigger update
      ref.current.elementChangeHandler('foo', 'bar');

      // Test
      expect(handleUpdate).toHaveBeenCalledWith({ foo: 'bar' }, false, []);
    });

    it('should forward validation errors from form actions', () => {
      // Create mocked Form builder.
      const handleUpdate = jest.fn();
      const ref = React.createRef();
      render((
        <Builder
          ref={ref}
          validationErrors={[]}
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

      // This mock handler adds a validation error for the field 'foo'
      ref.current.actionListener.notify = () => ({
        formData: {
          foo: 'bar',
        },
        validationErrors: {
          foo: 'bar baz!',
        },
        elementVisibility: {
          foo: true,
        },
      });

      // Trigger update
      ref.current.elementChangeHandler('foo', 'bar');

      // Test
      expect(handleUpdate).toHaveBeenCalledWith(
        { foo: 'bar' },
        true,
        [{
          path: 'foo',
          message: 'bar baz!',
        }]
      );
    });
  });

  describe('Builder::elementSortFunc', () => {
    const builder = new Builder({
      validationErrors: [],
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
