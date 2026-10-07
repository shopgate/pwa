/* eslint-disable extra-rules/no-single-line-objects */
import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormBuilder from '.';

jest.mock('@shopgate/engage/components');

describe('<FormBuilder />', () => {
  it('should render empty form', () => {
    const { container } = render((
      <FormBuilder
        config={{
          fields: {
          },
        }}
        name="foo"
        handleUpdate={() => {}}
      />
    ));

    const form = container.querySelector('form');

    expect(form).toHaveClass('ui-shared__form');
    expect(form.children).toHaveLength(1);
    expect(form.firstElementChild).toBeEmptyDOMElement();
  });

  it('should render two text fields', () => {
    const { container } = render((
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

    const inputs = screen.getAllByRole('textbox');

    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveAttribute('name', 'foo.firstName');
    expect(inputs[0]).toHaveValue('');
    expect(inputs[1]).toHaveAttribute('name', 'foo.lastName');
    expect(inputs[1]).toHaveValue('');
    expect(Array.from(container.querySelectorAll('label')).map(label => label.textContent))
      .toEqual(['foo', 'bar']);
  });

  it('should not render invisible field', () => {
    const { container } = render((
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

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(container.querySelector('form').firstElementChild).toBeEmptyDOMElement();
  });

  it('should hide element if setVisibilty rule applies', () => {
    const { container } = render((
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

    expect(screen.getAllByRole('textbox').map(input => input.name)).toEqual(['foo.foo', 'foo.bar']);
    expect(container.querySelectorAll('label')).toHaveLength(2);

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'abc' } });

    expect(screen.getAllByRole('textbox').map(input => input.name)).toEqual(['foo.foo']);
    expect(screen.getByRole('textbox')).toHaveValue('abc');
    expect(container.querySelectorAll('label')).toHaveLength(1);
  });

  it('should reset value when rule applies', () => {
    const { container } = render((
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

    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('default');
    expect(screen.getAllByRole('textbox')[1]).toHaveValue('default');
    expect(container.querySelectorAll('label.floating')).toHaveLength(2);

    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'abc' } });

    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('abc');
    expect(screen.getAllByRole('textbox')[1]).toHaveValue('cheat');
  });

  it('should call onChange callback when input is changed', () => {
    const handleUpdate = jest.fn();
    const { container } = render((
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

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'foo.foo');
    expect(screen.getByRole('textbox')).toHaveValue('default');
    expect(container.querySelector('label')).toHaveTextContent('foo');
    expect(handleUpdate).toHaveBeenCalledWith({ foo: 'default' }, false);
    handleUpdate.mockClear();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });

    expect(handleUpdate).toHaveBeenCalledWith({ foo: 'abc' }, false);
    expect(screen.getByRole('textbox')).toHaveValue('abc');
  });

  describe('FormBuilder::elementChangeHandler', () => {
    it('should take the updated state from action listener', () => {
      const handleUpdate = jest.fn();
      const ref = createRef();
      render((
        <FormBuilder
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
        errors: {},
        elementVisibility: {
          foo: true,
        },
      });

      handleUpdate.mockClear();

      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'typed' } });

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      expect(handleUpdate).toHaveBeenCalledWith({
        foo: 'bar',
      }, false);
      expect(screen.getByRole('textbox')).toHaveValue('bar');
    });

    it('should consider backend validations', () => {
      const handleUpdate = jest.fn();
      const ref = createRef();
      render((
        <FormBuilder
          ref={ref}
          validationErrors={[{}]}
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
        errors: {},
        elementVisibility: {
          foo: true,
        },
      });

      handleUpdate.mockClear();

      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'typed' } });

      expect(handleUpdate).toHaveBeenCalledTimes(1);
      expect(handleUpdate).toHaveBeenCalledWith({
        foo: 'bar',
      }, true);
    });
  });

  describe('FormBuilder::elementSortFunc', () => {
    const builder = new FormBuilder({
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
      expect(fields.sort(builder.elementSortFunc).map(field => field.id)).toEqual(['foo2', 'foo']);
    });
    it('should keep sortOrder', () => {
      const fields = [{ ...field2, sortOrder: 1 }, { ...field1, sortOrder: 2 }];
      expect(fields.sort(builder.elementSortFunc).map(field => field.id)).toEqual(['foo2', 'foo']);
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
