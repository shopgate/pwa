import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconButton from './IconButton';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});

const button = () => screen.getByRole('button');

/**
 * Collects the css text of every rule that targets a button's generated root class.
 * @param element The rendered button.
 * @returns The matching rules, joined by newlines.
 */
const rulesFor = (element: HTMLElement) => {
  const emotionClass = Array.from(element.classList).find(name => name.startsWith('sg-'));

  return Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
    .filter(rule => rule.includes(`.${emotionClass}`))
    .join('\n');
};

/**
 * Reads the box-shadow a button draws.
 * @param element The rendered button.
 * @returns The declared value, or null when the button declares none.
 */
const shadowOf = (element: HTMLElement) => {
  const match = rulesFor(element).match(/box-shadow: ([^;]+);/);

  return match ? match[1] : null;
};

describe('<IconButton /> css hooks', () => {
  it('should carry a stable class instead of the button base one', () => {
    render(<IconButton aria-label="Add">★</IconButton>);

    expect(button()).toHaveClass('engage__icon-button');
    expect(button()).not.toHaveClass('engage__button-base');
  });

  it('should expose its configuration as data attributes', () => {
    render(
      <IconButton aria-label="Add" variant="surface" color="primary" size="large" shape="rounded">
        ★
      </IconButton>
    );

    expect(button()).toHaveAttribute('data-variant', 'surface');
    expect(button()).toHaveAttribute('data-color', 'primary');
    expect(button()).toHaveAttribute('data-size', 'large');
    expect(button()).toHaveAttribute('data-shape', 'rounded');
  });

  it('should omit the boolean modifiers when they are off', () => {
    render(<IconButton aria-label="Add">★</IconButton>);

    expect(button()).not.toHaveAttribute('data-loading');
  });

  it('should append the consumer class name last', () => {
    render(<IconButton aria-label="Add" className="custom">★</IconButton>);

    const classList = Array.from(button().classList);

    expect(classList.indexOf('custom')).toBeGreaterThan(classList.indexOf('engage__icon-button'));
  });
});

describe('<IconButton /> content', () => {
  it('should render the icon and take its name from aria-label', () => {
    render(<IconButton aria-label="Add to favorites"><span data-testid="icon" /></IconButton>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument();
  });

  it('should replace the icon with a loading indicator and disable itself', () => {
    render(
      <IconButton aria-label="Add" loading>
        <span data-testid="icon" />
      </IconButton>
    );

    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(button()).toBeDisabled();
    expect(button()).toHaveAttribute('data-loading', 'true');
  });

  it('should render a custom loading indicator', () => {
    render(
      <IconButton aria-label="Add" loading loadingIndicator={<span data-testid="spinner" />}>
        <span data-testid="icon" />
      </IconButton>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });
});

describe('<IconButton /> surface', () => {
  it('should mix the hover overlay into the surface instead of replacing it', () => {
    render(<IconButton aria-label="Add" variant="surface">★</IconButton>);

    const hoverRules = rulesFor(button())
      .split('\n')
      .filter(rule => rule.includes(':hover'))
      .join('\n');

    expect(hoverRules).toContain('color-mix(in srgb, currentColor 10%, var(--icon-button-background, transparent))');
  });
});

describe('<IconButton /> elevation', () => {
  // The token stays unseeded, so it only resolves once something declares it. That is how the
  // product header elevates the buttons in its cta row and how merchant css overrides them.
  it('should draw no shadow while neither the token nor elevation is set', () => {
    render(<IconButton aria-label="Add">★</IconButton>);

    expect(shadowOf(button())).toBe('var(--sg-components-iconButton-boxShadow, none)');
  });

  it('should offer the shadow of a shadow size as the fallback of the token', () => {
    render(<IconButton aria-label="Add" elevation="strong">★</IconButton>);

    expect(shadowOf(button())).toMatch(/^var\(--sg-components-iconButton-boxShadow, .+px/);
  });

  it('should keep the token reachable for a zero elevation', () => {
    render(<IconButton aria-label="Add" elevation={0}>★</IconButton>);

    expect(shadowOf(button())).toBe('var(--sg-components-iconButton-boxShadow, none)');
  });

  it('should draw a different shadow per shadow size', () => {
    render(
      <>
        <IconButton aria-label="Low" elevation="low">★</IconButton>
        <IconButton aria-label="Strong" elevation="strong">★</IconButton>
      </>
    );

    const low = shadowOf(screen.getByRole('button', { name: 'Low' }));
    const strong = shadowOf(screen.getByRole('button', { name: 'Strong' }));

    expect(low).not.toBeNull();
    expect(strong).not.toBeNull();
    expect(low).not.toBe(strong);
  });
});
