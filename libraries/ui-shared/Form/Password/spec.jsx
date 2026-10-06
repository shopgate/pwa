import { render, screen, fireEvent } from '@testing-library/react';
import Password from './index';

const inputProps = {
  name: 'test-input',
};

describe('<Password>', () => {
  it('should render a password field', () => {
    const { container } = render(<Password {...inputProps} />);

    expect(container.querySelector('.ui-shared__form__password')).toBeInTheDocument();
    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(container.querySelector('input')).toHaveAttribute('type', 'password');
    expect(container.querySelector('input')).toHaveAttribute('name', 'test-input');
    expect(container.querySelector('input')).toHaveValue('');
    expect(container.querySelectorAll('.ui-shared__toggle-icon')).toHaveLength(1);
  });

  it('should trigger the onChange callback', () => {
    const onChangeMock = jest.fn();

    const { container } = render(<Password {...inputProps} onChange={onChangeMock} />);

    fireEvent.change(container.querySelector('input'), { target: { value: 'a' } });

    expect(onChangeMock).toHaveBeenCalledTimes(2);
    expect(container.querySelector('input')).toHaveValue('a');
  });

  it('should toggle password visibility', () => {
    const { container } = render(<Password {...inputProps} />);

    expect(container.querySelectorAll('input[type="password"]')).toHaveLength(1);

    fireEvent.click(container.querySelector('.ui-shared__toggle-icon'));

    expect(screen.getAllByRole('textbox')).toHaveLength(1);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    expect(container.querySelector('input[type="password"]')).not.toBeInTheDocument();
  });
});
