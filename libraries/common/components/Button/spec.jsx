import { render, screen, fireEvent } from '@testing-library/react';
import Button from './index';

describe('<Button />', () => {
  it('should render the button', () => {
    render(<Button>My content</Button>);

    const button = screen.getByRole('button', { name: 'My content' });

    expect(button).toBeEnabled();
    expect(button).toHaveClass('common__button');
    expect(button).toHaveAttribute('data-test-id', 'Button');
  });

  it('should render the button in disabled state', () => {
    render(<Button disabled>My content</Button>);

    const button = screen.getByRole('button', { name: 'My content' });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('common__button');
    expect(button).toHaveAttribute('data-test-id', 'Button');
  });

  it('should trigger the click event', () => {
    const callback = jest.fn();

    render(<Button onClick={callback}>My content</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'My content' }));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not trigger the click event when disabled', () => {
    const callback = jest.fn();

    render(<Button disabled onClick={callback}>My content</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'My content' }));

    expect(callback).not.toHaveBeenCalled();
  });
});
