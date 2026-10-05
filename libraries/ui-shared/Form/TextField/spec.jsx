import { render, screen, fireEvent } from '@testing-library/react';
import TextField from './index';

const inputProps = {
  name: 'test-input',
};

jest.mock('@shopgate/engage/components');

describe('<TextField>', () => {
  it('should render a simple text field', () => {
    const { container } = render(<TextField {...inputProps} />);

    const input = screen.getByRole('textbox');

    expect(container.querySelector('.ui-shared__form__text-field'))
      .toHaveClass('ui-shared__form-element');
    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(input).toHaveAttribute('name', 'test-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('');
    expect(container.querySelector('.underline')).toBeInTheDocument();
    expect(container.querySelector('label')).not.toBeInTheDocument();
    expect(container.querySelector('.placeholder')).not.toBeInTheDocument();
    expect(container.querySelector('.errorText')).not.toBeInTheDocument();
  });

  it('should render the text field as password', () => {
    const { container } = render(<TextField {...inputProps} password />);

    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(container.querySelector('input')).toHaveAttribute('type', 'password');
  });

  it('should render the text field with a default value', () => {
    render(<TextField {...inputProps} value="FooBar" />);

    expect(screen.getAllByRole('textbox')).toHaveLength(1);
    expect(screen.getByRole('textbox')).toHaveValue('FooBar');
  });

  it('should trigger the onChange callback', () => {
    const onChangeMock = jest.fn();

    render(<TextField {...inputProps} onChange={onChangeMock} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('textbox')).toHaveValue('a');
  });

  it('should receive the correct value while typing', () => {
    render(<TextField {...inputProps} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'foobar' } });

    expect(input).toHaveValue('foobar');
  });

  it('should sanitize the input', () => {
    render(<TextField
      {...inputProps}
      onSanitize={value => value.toUpperCase()}
    />);

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
    const underline = container.querySelector('.underline').firstElementChild;

    expect(onFocusMock).not.toHaveBeenCalled();
    expect(underline).toHaveStyle({ transform: 'scale3d(0,1,1)' });

    fireEvent.focus(input);

    expect(onFocusMock).toHaveBeenLastCalledWith(true);
    expect(underline.style.transform).toBe('');

    fireEvent.blur(input);

    expect(onFocusMock).toHaveBeenLastCalledWith(false);
    expect(underline).toHaveStyle({ transform: 'scale3d(0,1,1)' });
  });

  it('should show the error message', () => {
    const errorText = 'This is an error here';

    const { container } = render(<TextField {...inputProps} errorText={errorText} />);

    expect(container.querySelector('.errorText')).toHaveTextContent(errorText);
    expect(container.querySelector('.errorText')).toHaveAttribute('id', 'ariaError-test-input');
  });

  it('should show the label', () => {
    const label = 'This is the label';

    const { container } = render(<TextField {...inputProps} label={label} />);

    expect(container.querySelector('label')).toHaveTextContent(label);
    expect(container.querySelector('label')).toHaveAttribute('for', 'test-input');
    expect(container.querySelector('.placeholder')).toHaveTextContent(label);
  });

  it('should show the placeholder text', () => {
    const placeholder = 'This is the placeholder text';

    const { container } = render(<TextField {...inputProps} placeholder={placeholder} />);

    expect(container.querySelector('.placeholder')).toHaveTextContent(placeholder);
    expect(container.querySelector('.placeholder')).not.toHaveStyle({ opacity: 0 });
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });
});
