import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Loaded at runtime by utils/unit-tests/envSetup.js; imported here for the matcher types.
import '@testing-library/jest-dom';
import ButtonBase from './ButtonBase';

// ButtonBase resolves the reduced motion preference via matchMedia, which jsdom doesn't implement.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});

describe('<ButtonBase />', () => {
  it('should render the testId as a data-test-id attribute', () => {
    render(<ButtonBase testId="MyButton">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('data-test-id', 'MyButton');
  });

  it('should not render a data-test-id attribute when no testId is given', () => {
    render(<ButtonBase>Press</ButtonBase>);

    expect(screen.getByRole('button')).not.toHaveAttribute('data-test-id');
  });

  it('should let an explicit data-test-id win over the testId prop', () => {
    render(<ButtonBase testId="FromProp" data-test-id="FromAttribute">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('data-test-id', 'FromAttribute');
  });

  it('should default the button type to "button" to avoid implicit form submits', () => {
    render(<ButtonBase>Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should pass through a submit type', () => {
    render(<ButtonBase type="submit">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should fall back to "button" for an unsupported type', () => {
    render(<ButtonBase type={'menu' as 'button'}>Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should submit a surrounding form when the type is submit', () => {
    const handleSubmit = jest.fn(event => event.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <ButtonBase type="submit">Send</ButtonBase>
      </form>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should not submit a surrounding form by default', () => {
    const handleSubmit = jest.fn(event => event.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <ButtonBase>Send</ButtonBase>
      </form>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should not invoke onClick while disabled', () => {
    const handleClick = jest.fn();

    render(<ButtonBase disabled onClick={handleClick}>Press</ButtonBase>);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should forward the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<ButtonBase ref={ref}>Press</ButtonBase>);

    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('should keep a consumer className on the button', () => {
    render(<ButtonBase className="custom">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('should not spread the classes prop onto the DOM', () => {
    render(<ButtonBase classes={{ root: 'custom-root' }}>Press</ButtonBase>);

    expect(screen.getByRole('button')).not.toHaveAttribute('classes');
  });
});
