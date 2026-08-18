import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonGroup from './ButtonGroup';
import Button from '../Button';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});

describe('<ButtonGroup /> css hooks', () => {
  const group = () => screen.getByRole('group');

  it('should carry a stable class', () => {
    render(<ButtonGroup><Button>One</Button></ButtonGroup>);

    expect(group()).toHaveClass('engage__button-group');
  });

  it('should expose its configuration as data attributes', () => {
    render(
      <ButtonGroup variant="outlined" color="primary" size="large" orientation="vertical">
        <Button>One</Button>
      </ButtonGroup>
    );

    expect(group()).toHaveAttribute('data-variant', 'outlined');
    expect(group()).toHaveAttribute('data-color', 'primary');
    expect(group()).toHaveAttribute('data-size', 'large');
    expect(group()).toHaveAttribute('data-orientation', 'vertical');
  });

  it('should expose disabled, which a div cannot express through :disabled', () => {
    render(<ButtonGroup disabled><Button>One</Button></ButtonGroup>);

    expect(group()).toHaveAttribute('data-disabled', 'true');
  });

  it('should omit the boolean modifiers when they are off', () => {
    render(<ButtonGroup><Button>One</Button></ButtonGroup>);

    expect(group()).not.toHaveAttribute('data-disabled');
    expect(group()).not.toHaveAttribute('data-dense');
    expect(group()).not.toHaveAttribute('data-full-width');
  });
});
