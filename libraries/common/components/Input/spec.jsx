import { render, screen, fireEvent } from '@testing-library/react';
import Input from './index';

describe('<Input />', () => {
  it('should render a simple input field', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');

    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveClass('simpleInput', 'common__simple-input');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('autocorrect', 'off');
    expect(input).toHaveValue('');
    expect(input).toBeEnabled();
    expect(input).not.toBeRequired();
  });

  it('should render the input as password', () => {
    const { container } = render(<Input password />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveValue('');
  });

  it('should render the input with a default value', () => {
    render(<Input value="FooBar" />);

    expect(screen.getByRole('textbox')).toHaveValue('FooBar');
  });

  it('should trigger the onChange callback', () => {
    const onChangeMock = jest.fn();

    render(<Input onChange={onChangeMock} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock.mock.lastCall[0]).toEqual('a');
    expect(screen.getByRole('textbox')).toHaveValue('a');
  });

  it('should receive the correct value while typing', () => {
    render(<Input />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'foobar' } });

    expect(screen.getByRole('textbox')).toHaveValue('foobar');
  });

  it('should sanitize the input', () => {
    render(<Input onSanitize={value => value.toUpperCase()} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'foobar' } });

    expect(screen.getByRole('textbox')).toHaveValue('FOOBAR');
  });

  it('should validate the input', () => {
    const onValidate = jest.fn(() => false);

    render(<Input onValidate={onValidate} />);

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenLastCalledWith('', true);

    fireEvent.blur(screen.getByRole('textbox'));

    expect(onValidate).toHaveBeenCalledTimes(2);
    expect(onValidate).toHaveBeenLastCalledWith('', false);
  });

  it('should focus the input', () => {
    const onFocusMock = jest.fn();

    render(<Input onFocusChange={onFocusMock} />);

    const input = screen.getByRole('textbox');

    expect(onFocusMock).not.toHaveBeenCalled();

    fireEvent.focus(input);

    expect(onFocusMock).toHaveBeenCalledTimes(1);
    expect(onFocusMock.mock.lastCall[0]).toEqual(true);

    fireEvent.blur(input);

    expect(onFocusMock).toHaveBeenCalledTimes(2);
    expect(onFocusMock.mock.lastCall[0]).toEqual(false);
  });

  it('should change the value on user input', () => {
    render(<Input value="My initial value" />);

    expect(screen.getByRole('textbox')).toHaveValue('My initial value');

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'foobar' } });

    expect(screen.getByRole('textbox')).toHaveValue('foobar');
  });

  it('should render a multiline input with empty content and react on change', () => {
    const multiLineValue = `dfsdsdf
    sdfdsff
    dsf`;
    const { rerender } = render(<Input value="" multiLine />);

    const textarea = screen.getByRole('textbox');

    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveClass('multiLineInput', 'common__multi-line-input');
    expect(textarea).toHaveValue('');
    rerender(<Input value={multiLineValue} multiLine />);
    expect(screen.getByRole('textbox')).toHaveValue(multiLineValue);
    expect(screen.getByRole('textbox').innerHTML).toEqual(multiLineValue);
  });

  it('should render additional html attributes', () => {
    const { container } = render((
      <Input
        type="date"
        attributes={{
          min: '1970-01-01',
          max: '2010-01-01',
        }}
      />
    ));

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveAttribute('min', '1970-01-01');
    expect(input).toHaveAttribute('max', '2010-01-01');
    expect(input).toHaveClass('simpleInput', 'common__simple-input');
    expect(input).toHaveValue('');
  });
});
