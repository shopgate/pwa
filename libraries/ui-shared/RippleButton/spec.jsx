import { render, screen, within } from '@testing-library/react';
import RippleButton from './index';

describe('<RippleButton />', () => {
  it('should render as a regular ripple button effect if type is omitted', () => {
    const { container } = render(<RippleButton>Press me</RippleButton>);

    const button = screen.getByRole('button', { name: 'Press me' });

    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('data-test-id', 'Button');
    expect(container.querySelector('[data-test-id="Ripple"]')).toHaveTextContent('Press me');
  });

  it('should style the regular, primary and secondary ripple button differently', () => {
    render((
      <>
        <RippleButton type="regular">Regular</RippleButton>
        <RippleButton type="primary">Primary</RippleButton>
        <RippleButton type="secondary">Secondary</RippleButton>
      </>
    ));

    const regular = screen.getByRole('button', { name: 'Regular' });
    const primary = screen.getByRole('button', { name: 'Primary' });
    const secondary = screen.getByRole('button', { name: 'Secondary' });

    expect(regular).toHaveClass('ui-shared__button', 'ui-shared__ripple-button');
    expect(primary).toHaveClass('ui-shared__button', 'ui-shared__ripple-button');
    expect(secondary).toHaveClass('ui-shared__button', 'ui-shared__ripple-button');
    expect(regular.querySelector('[data-test-id="Ripple"]')).toHaveTextContent('Regular');
    expect(regular.className).not.toBe(primary.className);
    expect(regular.className).not.toBe(secondary.className);
    expect(primary.className).not.toBe(secondary.className);
  });

  it('should render as a disabled ripple button', () => {
    render(<RippleButton disabled>Press me</RippleButton>);

    const button = screen.getByRole('button', { name: 'Press me' });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('ui-shared__button', 'ui-shared__ripple-button');
    expect(within(button).getByText('Press me')).toBeInTheDocument();
    expect(button.querySelector('[data-test-id="Ripple"]')).not.toBeInTheDocument();
  });
});
