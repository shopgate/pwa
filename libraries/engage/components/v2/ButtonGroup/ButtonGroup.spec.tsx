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

describe('<ButtonGroup /> outlined border', () => {
  /**
   * Reads the css rules that apply to the first grouped button in a given state.
   * @param state The selector that follows the class name, e.g. `:hover`.
   * @returns The css text of the matching rules.
   */
  const buttonStateRule = (state: string) => {
    const className = screen.getAllByRole('button')[0].className.trim().split(' ').pop();

    return Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
      .filter(text => text.includes(`.${className}${state}`))
      .join('\n');
  };

  // The group used to paint the resting border itself with an `!important`, which the hover rule
  // could never win against, so the hover color never showed. The button owns both ends now.
  it('should rest on a faded border and return to the full color on hover', () => {
    render(
      <ButtonGroup variant="outlined" color="primary">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );

    expect(buttonStateRule(' ')).toContain('--variant-outlinedBorder: oklch(from var(--button-color) l c h / 0.5);');
    expect(buttonStateRule(':hover')).toContain('--variant-outlinedBorder: var(--button-color);');
  });

  it('should not force the resting border color with an important declaration', () => {
    render(
      <ButtonGroup variant="outlined" color="primary">
        <Button>One</Button>
      </ButtonGroup>
    );

    expect(buttonStateRule(' ')).not.toContain('border-color: color-mix');
  });
});

describe('<ButtonGroup /> contained divider', () => {
  it('should draw the divider from the shared custom property', () => {
    render(
      <ButtonGroup variant="contained" color="primary">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );

    const className = screen.getAllByRole('button')[0].className.trim().split(' ').pop();
    const rules = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
      .filter(text => text.includes(`.${className}`))
      .join('\n');

    expect(rules).toContain('border-right-color: var(--button-group-divider)');
    expect(rules).not.toContain('border-right-color: color-mix');
  });
});

describe('<ButtonGroup /> text separator', () => {
  /**
   * Reads the css rules that apply to the first grouped button.
   * @returns The css text of the matching rules.
   */
  const buttonRules = () => {
    const className = screen.getAllByRole('button')[0].className.trim().split(' ').pop();

    return Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
      .filter(text => text.includes(`.${className}`))
      .join('\n');
  };

  // Mixing the group color with white turned the separator into a near white line as soon as the
  // dark scheme put a light color into it. Fading it toward the background mutes it in both.
  it('should fade the separator toward the background instead of toward white', () => {
    render(
      <ButtonGroup variant="text" color="primary">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );

    const rules = buttonRules();

    expect(rules).toContain('border-right-color: var(--button-group-separator)');
    expect(rules).not.toContain('#fff 50%');
  });

  // Local custom properties, so neither the color nor its opacity is baked into the border
  // declarations of the two orientations.
  it('should expose the separator color and its opacity as custom properties', () => {
    render(
      <ButtonGroup variant="text" color="primary">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    );

    const emotionClass = Array.from(screen.getByRole('group').classList)
      .find(name => name.startsWith('sg-'));
    const groupRule = Array.from(document.styleSheets)
      .flatMap(sheet => Array.from(sheet.cssRules || []).map(rule => rule.cssText))
      .filter(text => text.includes(`.${emotionClass}`))
      .join('\n');

    expect(groupRule).toContain('--button-group-separator-opacity: 0.5;');
    expect(groupRule).toContain('--button-group-separator: oklch(from var(--button-group-color) l c h / calc(var(--button-group-separator-opacity)))');
  });
});
