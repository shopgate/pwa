import { render, screen } from '@testing-library/react';
import Button from './index';

describe('<Button />', () => {
  it('should render as a regular button if type is omitted', () => {
    render(<Button>Press me</Button>);

    const button = screen.getByRole('button', { name: 'Press me' });

    expect(button).toHaveTextContent('Press me');
    expect(button).toHaveClass('ui-shared__button');
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('data-test-id', 'Button');
  });

  it('should style the regular, primary and secondary button differently', () => {
    render((
      <>
        <Button type="regular">Regular</Button>
        <Button type="primary">Primary</Button>
        <Button type="secondary">Secondary</Button>
      </>
    ));

    const regular = screen.getByRole('button', { name: 'Regular' });
    const primary = screen.getByRole('button', { name: 'Primary' });
    const secondary = screen.getByRole('button', { name: 'Secondary' });

    expect(regular).toHaveClass('ui-shared__button');
    expect(primary).toHaveClass('ui-shared__button');
    expect(secondary).toHaveClass('ui-shared__button');
    expect(regular.className).not.toBe(primary.className);
    expect(regular.className).not.toBe(secondary.className);
    expect(primary.className).not.toBe(secondary.className);
  });
});
