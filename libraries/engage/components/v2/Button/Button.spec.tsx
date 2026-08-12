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
const getButtonRule = () => {
  const className = screen.getByRole('button').className.trim().split(' ').pop();

  return Array.from(document.querySelectorAll('style'))
    .flatMap((styleElement) => {
      const { sheet } = styleElement as HTMLStyleElement;
      return sheet ? Array.from(sheet.cssRules).map(rule => rule.cssText) : [];
    })
    .find(text => text.startsWith(`.${className} `)) || '';
};

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

  describe('loading', () => {
    it('should disable the button while loading', () => {
      render(<Button loading>Press</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
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
