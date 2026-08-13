import React from 'react';
import { render, screen } from '@testing-library/react';
// Loaded at runtime by utils/unit-tests/envSetup.js; imported here for the matcher types.
import '@testing-library/jest-dom';
import { css } from '@shopgate/engage/styles';
import Button from './Button';

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

/**
 * Reads the css rule that the emotion classes of the rendered button resolved to. `cx` merges all
 * emotion classes into a single generated class, so the resulting rule contains the declarations of
 * every merged class in the order they were passed to `cx`. The last declaration for a property is
 * the one that applies.
 * @returns The css text of the rule.
 */
const getRuleFor = (element: Element) => {
  const className = element.className.trim().split(' ').pop();

  return Array.from(document.querySelectorAll('style'))
    .flatMap((styleElement) => {
      const { sheet } = styleElement as HTMLStyleElement;
      return sheet ? Array.from(sheet.cssRules).map(rule => rule.cssText) : [];
    })
    .find(text => text.startsWith(`.${className} `)) || '';
};

const getButtonRule = () => getRuleFor(screen.getByRole('button'));

/**
 * Reads the shorthand `padding` declaration of a css rule, ignoring the longhands.
 * @param rule The css rule text.
 * @returns The padding value.
 */
const paddingOf = (rule: string) => (rule.match(/[;{] padding: ([^;]+);/) || [])[1];

describe('<Button />', () => {
  describe('className precedence', () => {
    it('should let a consumer class win over the variant styles', () => {
      const consumerClass = css({ background: 'rebeccapurple' });

      render(
        <Button variant="contained" color="primary" className={consumerClass}>
          Press
        </Button>
      );

      const backgrounds = getButtonRule().match(/background:[^;]*;/g) || [];

      expect(backgrounds[backgrounds.length - 1]).toBe('background: rebeccapurple;');
    });

    it('should keep a plain class name on the button', () => {
      render(<Button className="custom">Press</Button>);

      expect(screen.getByRole('button')).toHaveClass('custom');
    });
  });

  describe('colors', () => {
    it('should resolve the cta color from the ctaButton component token', () => {
      render(<Button variant="contained" color="cta">Checkout</Button>);

      expect(getButtonRule()).toContain('--sg-components-ctaButton-background');
    });

    it('should resolve a palette color from the palette', () => {
      render(<Button variant="contained" color="primary">Press</Button>);

      const rule = getButtonRule();

      expect(rule).toContain('--sg-palette-primary-main');
      expect(rule).not.toContain('--sg-components-ctaButton-background');
    });
  });

  describe('dimensions', () => {
    it('should reserve the same border box for outlined and contained buttons', () => {
      render(
        <>
          <Button color="primary" testId="contained">Press</Button>
          <Button variant="outlined" color="primary" testId="outlined">Press</Button>
        </>
      );

      const contained = getRuleFor(document.querySelector('[data-test-id="contained"]') as Element);
      const outlined = getRuleFor(document.querySelector('[data-test-id="outlined"]') as Element);

      expect(contained).toContain('border: 1px solid transparent;');
      expect(outlined).toContain('border: 1px solid transparent;');
      expect(outlined).toContain('border-color: var(--variant-outlinedBorder);');
      expect(paddingOf(contained)).toBe('5px 15px');
      expect(paddingOf(outlined)).toBe('5px 15px');
    });
  });

  describe('dense', () => {
    it.each([
      ['medium', undefined, '5px 15px', '2px 7px'],
      ['small', 'small', '4px 9px', '2px 4px'],
      ['large', 'large', '7px 21px', '3px 10px'],
    ] as const)('should reduce the %s padding', (_name, size, regular, reduced) => {
      const { unmount } = render(<Button size={size}>Press</Button>);
      expect(paddingOf(getButtonRule())).toBe(regular);
      unmount();

      render(<Button size={size} dense>Press</Button>);
      expect(paddingOf(getButtonRule())).toBe(reduced);
    });
  });

  describe('elevation', () => {
    // `box-shadow` also appears in the root `transition`, so match the declaration itself.
    it('should render a contained button without a shadow by default', () => {
      render(<Button color="primary">Press</Button>);

      expect(getButtonRule()).not.toContain('box-shadow:');
    });

    it('should add a shadow when elevation is enabled', () => {
      render(<Button color="primary" enableElevation>Press</Button>);

      expect(getButtonRule()).toContain('box-shadow:');
    });
  });

  describe('loading', () => {
    it('should disable the button while loading', () => {
      render(<Button loading>Press</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should mark a non-button element as disabled while loading', () => {
      render(<Button component="a" loading testId="Loading">Press</Button>);

      const link = document.querySelector('[data-test-id="Loading"]') as HTMLElement;

      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('disabled');
    });
  });

  it('should pass the testId through to the button element', () => {
    render(<Button testId="CheckoutButton">Checkout</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('data-test-id', 'CheckoutButton');
  });

  it('should not spread the classes prop onto the DOM', () => {
    render(<Button classes={{ root: 'custom-root' }}>Press</Button>);

    expect(screen.getByRole('button')).not.toHaveAttribute('classes');
  });
});

describe('<Button /> css hooks', () => {
  it('should carry its own stable class instead of the base one', () => {
    render(<Button>Press</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('engage__button');
    expect(button).not.toHaveClass('engage__button-base');
  });

  it('should keep emitting the classes the legacy styled buttons carried', () => {
    render(<Button>Press</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveClass('common__button');
    expect(button).toHaveClass('ui-shared__button');
    expect(button).toHaveClass('ui-shared__ripple-button');
  });

  it('should drop the ripple class when the button does not ripple', () => {
    render(<Button disableRipple>Press</Button>);

    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('ui-shared__ripple-button');
    expect(button).toHaveClass('ui-shared__button');
  });

  it('should not claim legacy classes that never belonged to the button element', () => {
    render(<Button>Press</Button>);

    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('ui-shared__action-button');
    expect(button).not.toHaveClass('ui-shared__button-link');
  });

  it('should place the consumer className after the stable ones', () => {
    // `cx` merges every emotion class into one and appends it, so a plain class is never the last
    // token. What matters is that the caller's class follows ours among the plain names.
    render(<Button className="custom">Press</Button>);

    const classList = screen.getByRole('button').className.trim().split(' ');

    expect(classList.indexOf('custom')).toBeGreaterThan(classList.indexOf('engage__button'));
  });

  it('should expose its configuration as data attributes', () => {
    render(<Button variant="outlined" color="cta" size="large">Press</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-variant', 'outlined');
    expect(button).toHaveAttribute('data-color', 'cta');
    expect(button).toHaveAttribute('data-size', 'large');
  });

  it('should expose the boolean modifiers only when they are on', () => {
    const { unmount } = render(<Button>Press</Button>);

    expect(screen.getByRole('button')).not.toHaveAttribute('data-dense');
    expect(screen.getByRole('button')).not.toHaveAttribute('data-full-width');
    unmount();

    render(<Button dense fullWidth enableElevation>Press</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-dense', 'true');
    expect(button).toHaveAttribute('data-full-width', 'true');
    expect(button).toHaveAttribute('data-enable-elevation', 'true');
  });

  it('should expose the loading state, but leave disabled to :disabled and aria-disabled', () => {
    render(<Button loading>Press</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).not.toHaveAttribute('data-disabled');
    expect(button).toBeDisabled();
  });

  it('should omit data-loading when not loading', () => {
    render(<Button>Press</Button>);

    expect(screen.getByRole('button')).not.toHaveAttribute('data-loading');
  });
});
