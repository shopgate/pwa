import { render, screen, fireEvent } from '@testing-library/react';
import TextField from './index';

const inputProps = {
  name: 'test-input',
};

describe('<TextField />', () => {
  it('should render a simple text field', () => {
    const { container } = render(<TextField {...inputProps} />);

    const input = screen.getByRole('textbox');

    expect(container.querySelector('.ui-shared__text-field')).toHaveClass('textField');
    expect(container.querySelector('.ui-shared__text-field')).not.toHaveClass('disabled');
    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).toHaveValue('');
    expect(input).toBeEnabled();
    expect(container.querySelector('label')).toHaveAttribute('for', 'test-input');
    expect(container.querySelector('label')).not.toHaveClass('floating');
    expect(container.querySelector('.errorText')).toHaveTextContent('');
  });

  it('should render the text field as password', () => {
    const { container } = render(<TextField {...inputProps} password />);

    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(container.querySelector('input')).toHaveAttribute('type', 'password');
    expect(container.querySelector('input')).toHaveAttribute('name', 'test-input');
  });

  it('should render the text field with a default value', () => {
    const { container } = render(<TextField {...inputProps} value="FooBar" />);

    expect(screen.getAllByRole('textbox')).toHaveLength(1);
    expect(screen.getByRole('textbox')).toHaveValue('FooBar');
    expect(container.querySelector('label')).toHaveClass('floating');
  });

  it('should trigger the onChange callback', () => {
    const onChangeMock = jest.fn();

    render(<TextField {...inputProps} onChange={onChangeMock} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(onChangeMock.mock.lastCall[0]).toEqual('a');
    expect(screen.getByRole('textbox')).toHaveValue('a');
  });

  it('should receive the correct value while typing', () => {
    render(<TextField {...inputProps} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'foobar' } });

    expect(input).toHaveValue('foobar');
  });

  it('should sanitize the input', () => {
    render(<TextField {...inputProps} onSanitize={value => value.toUpperCase()} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'foobar' } });

    expect(input).toHaveValue('FOOBAR');
  });

  it('should trigger the validation callback', () => {
    const onValidateMock = jest.fn();

    render(<TextField {...inputProps} onValidate={onValidateMock} />);

    expect(onValidateMock).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('should focus the input', () => {
    const onFocusMock = jest.fn();

    const { container } = render(<TextField {...inputProps} onFocusChange={onFocusMock} />);

    const input = screen.getByRole('textbox');

    expect(container.querySelector('label')).not.toHaveClass('floating');
    expect(onFocusMock).toHaveBeenCalledTimes(0);

    fireEvent.focus(input);

    expect(onFocusMock).toHaveBeenCalledTimes(1);
    expect(onFocusMock).toHaveBeenCalledWith(true);
    expect(container.querySelector('label')).toHaveClass('floating');

    fireEvent.blur(input);
    expect(onFocusMock).toHaveBeenCalledTimes(2);
    expect(onFocusMock).toHaveBeenCalledWith(false);
    expect(container.querySelector('label')).not.toHaveClass('floating');
  });

  it('should show the error message', () => {
    const errorText = 'This is an error here';

    const { container } = render(<TextField {...inputProps} errorText={errorText} />);

    const error = container.querySelector('.errorText');

    expect(error).toContainElement(screen.getByText(errorText));
    expect(error).toHaveAttribute('id', 'ariaError-test-input');
    expect(error).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'ariaError-test-input');
  });

  it('should show the label', () => {
    const label = 'This is the label';

    render(<TextField {...inputProps} label={label} />);

    expect(screen.getByLabelText(label)).toBe(screen.getByRole('textbox'));
    expect(screen.getByText(label).closest('label')).toHaveClass('label');
  });

  it('should show the hint text', () => {
    const hintText = 'This is the hint text';

    const { container } = render(<TextField {...inputProps} hintText={hintText} />);

    expect(container.querySelector('.hint')).toContainElement(screen.getByText(hintText));
  });

  it('should replace the error text with custom validation error', () => {
    /**
     * A custom validation method that always returns an error.
     * @return {string} The error message.
     */
    const onValidate = () => 'Custom validation error';

    const { container } = render(<TextField {...inputProps} onValidate={onValidate} />);

    fireEvent.blur(screen.getByRole('textbox'));

    expect(container.querySelector('.errorText')).toContainElement(screen.getByText(onValidate()));
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'ariaError-test-input');
  });
});
