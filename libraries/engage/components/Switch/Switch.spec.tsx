import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './Switch';

/**
 * Renders a switch and returns its root, input and label elements.
 * @param props The props of the switch.
 * @returns The elements and the function to render the switch again with other props.
 */
const renderSwitch = (props: React.ComponentProps<typeof Switch> = {}) => {
  const { container, rerender } = render(<Switch id="test" {...props}>Label</Switch>);
  const root = container.firstChild as HTMLElement;

  return {
    root,
    input: root.querySelector('input') as HTMLInputElement,
    label: root.querySelector('label') as HTMLLabelElement,
    rerender,
  };
};

/**
 * Collects the CSS rules that the generated classes of an element have.
 * @param element The element.
 * @returns The rules, one per line.
 */
const getStyles = (element: Element) => {
  const generated = Array.from(element.classList).filter(name => !name.startsWith('engage__'));

  return Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules))
    .map(rule => rule.cssText)
    .filter(rule => generated.some(name => rule.startsWith(`.${name}`)))
    .join('\n');
};

describe('engage > components > Switch', () => {
  describe('markup', () => {
    it('should render a checkbox with its label and stable classes', () => {
      const { container } = render(<Switch id="test" checked onChange={jest.fn()}>Label</Switch>);

      const input = screen.getByRole('checkbox', { name: 'Label' });
      expect(input).toBeChecked();
      expect(input).toHaveClass('engage__switch__input');
      expect(container.firstChild).toHaveClass('engage__switch');
      expect(screen.getByText('Label').closest('label')).toHaveClass('engage__switch__label');
    });

    it('should keep the markup of the switch without the new props', () => {
      const { root, input, label } = renderSwitch();

      expect(root.tagName).toBe('DIV');
      expect(root.classList).toHaveLength(2);
      expect(root.children).toHaveLength(2);
      expect(input.getAttributeNames().sort()).toEqual(['class', 'id', 'type']);
      expect(input.classList).toHaveLength(2);
      expect(label.getAttributeNames().sort()).toEqual(['class', 'for']);
      expect(label.innerHTML).toBe('<span aria-hidden="false">Label</span>');
    });

    it('should render without a label', () => {
      const { container } = render(<Switch />);

      expect(container.querySelector('label')).toBeNull();
      expect(container.querySelector('input')?.id).not.toBe('');
    });

    it('should offer a text for screen readers instead of the label', () => {
      renderSwitch({ a11yFallbackText: 'Screen reader label' });

      expect(screen.getByText('Label')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByRole('checkbox', { name: 'Screen reader label' })).toBeInTheDocument();
    });
  });

  describe('id', () => {
    it('should link the label with the input by the given id', () => {
      const { input, label } = renderSwitch();

      expect(input).toHaveAttribute('id', 'test');
      expect(label).toHaveAttribute('for', 'test');
    });

    it('should keep a generated id when it renders again', () => {
      const { container, rerender } = render(<Switch>Label</Switch>);
      const { id } = container.querySelector('input') as HTMLInputElement;

      rerender(<Switch checked>Label</Switch>);

      expect(id).not.toBe('');
      expect(container.querySelector('input')).toHaveAttribute('id', id);
      expect(container.querySelector('label')).toHaveAttribute('for', id);
    });
  });

  describe('interaction', () => {
    it('should be off by default', () => {
      renderSwitch();

      expect(screen.getByRole('checkbox')).not.toBeChecked();
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    it('should call onChange when it is toggled', () => {
      const onChange = jest.fn();
      render(<Switch id="test" checked={false} onChange={onChange}>Label</Switch>);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should pass the new state to onChange', () => {
      const onChange = jest.fn(
        (event: React.ChangeEvent<HTMLInputElement>) => event.target.checked
      );

      renderSwitch({ onChange });
      fireEvent.click(screen.getByRole('checkbox'));

      expect(onChange).toHaveReturnedWith(true);
    });

    it('should be toggled by a click on its label', () => {
      const onChange = jest.fn();

      renderSwitch({ onChange });
      fireEvent.click(screen.getByText('Label'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should disable the input', () => {
      renderSwitch({ disabled: true });

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('should show the state it gets', () => {
      const { rerender } = renderSwitch({
        checked: true,
        onChange: jest.fn(),
      });

      expect(screen.getByRole('checkbox')).toBeChecked();

      rerender(<Switch id="test" checked={false} onChange={jest.fn()}>Label</Switch>);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('styles', () => {
    it('should draw the medium size with the secondary color and theme hooks by default', () => {
      const styles = getStyles(renderSwitch().input);

      expect(styles).toContain('width: 40px; height: 20px;');
      expect(styles).toContain('var(--sg-components-switch-trackColor, var(--sg-palette-grey-medium))');
      expect(styles).toContain('var(--sg-components-switch-thumbColor, var(--sg-palette-common-white))');
      expect(styles).toContain(
        ':checked {background-color: var(--sg-components-switch-checkedTrackColor, var(--sg-palette-secondary-main));}'
      );
      expect(styles).toContain(':disabled {background-color: var(--sg-palette-action-disabledBackground);');
    });

    it('should not animate the knob for users who prefer reduced motion', () => {
      const { input } = renderSwitch();
      const generated = Array.from(input.classList).find(name => !name.startsWith('engage__'));
      const mediaRules = Array.from(document.styleSheets)
        .flatMap(sheet => Array.from(sheet.cssRules))
        .map(rule => rule.cssText)
        .filter(rule => rule.startsWith('@media (prefers-reduced-motion: reduce)'));

      expect(mediaRules.some(rule => (
        rule.includes(`.${generated}:before {`) && rule.includes(' transition: none;')
      ))).toBe(true);
    });

    it('should use the given color for the checked track', () => {
      const styles = getStyles(renderSwitch({ color: 'primary' }).input);

      expect(styles).toContain('var(--sg-components-switch-checkedTrackColor, var(--sg-palette-primary-main))');
    });

    it('should take the text color for the checked track with the inherit color', () => {
      const styles = getStyles(renderSwitch({ color: 'inherit' }).input);

      expect(styles).toContain('var(--sg-components-switch-checkedTrackColor, currentColor)');
      expect(styles).toContain(' color: inherit;');
    });

    it('should keep the text color of the input with a palette color', () => {
      const styles = getStyles(renderSwitch().input);

      expect(styles).not.toContain('color: inherit');
    });

    it('should draw the large size', () => {
      const styles = getStyles(renderSwitch({ size: 'large' }).input);

      expect(styles).toContain('width: 48px; height: 28px;');
      expect(styles).toContain(':before {width: 24px; height: 24px;}');
    });

    it('should place the label before the switch by default', () => {
      const styles = getStyles(renderSwitch().root);

      expect(styles).toContain('justify-content: space-between;');
      expect(styles).toContain('flex-direction: row-reverse;');
      expect(styles).toContain('gap: 32px;');
    });

    it('should only flip the label behind the switch', () => {
      const styles = getStyles(renderSwitch({ labelPlacement: 'end' }).root);

      expect(styles).toContain(' flex-direction: row;');
      expect(styles).toContain('justify-content: space-between;');
      expect(styles).toContain('gap: 32px;');
    });
  });

  describe('spacing', () => {
    it('should put the label right next to the switch without the spacing', () => {
      const styles = getStyles(renderSwitch({ disableSpacing: true }).root);

      expect(styles).toContain(' justify-content: flex-start;');
      expect(styles).toContain(' align-items: center;');
      expect(styles).toContain('gap: 12px;');
    });

    it('should remove the spacing for both placements', () => {
      const { root: start } = renderSwitch({ disableSpacing: true });
      const { root: end } = renderSwitch({
        disableSpacing: true,
        labelPlacement: 'end',
      });

      expect(getStyles(start)).toContain('flex-direction: row-reverse;');
      expect(getStyles(start)).toContain(' justify-content: flex-start;');
      expect(getStyles(end)).toContain(' flex-direction: row;');
      expect(getStyles(end)).toContain(' justify-content: flex-start;');
    });
  });

  describe('customization', () => {
    it('should pass the class name, the name and further attributes on', () => {
      const { root, input } = renderSwitch({
        className: 'custom',
        name: 'newsletter',
        inputProps: {
          role: 'switch',
          className: 'custom-input',
        },
      });

      expect(root).toHaveClass('engage__switch', 'custom');
      expect(input).toHaveAttribute('name', 'newsletter');
      expect(input).toHaveClass('engage__switch__input', 'custom-input');
      expect(screen.getByRole('switch', { name: 'Label' })).toBe(input);
    });

    it('should add the class names of the classes prop to the elements', () => {
      const { root, input, label } = renderSwitch({
        size: 'large',
        labelPlacement: 'end',
        disableSpacing: true,
        classes: {
          root: 'custom-root',
          labelEnd: 'custom-label-end',
          disableSpacing: 'custom-disable-spacing',
          input: 'custom-input',
          large: 'custom-large',
          label: 'custom-label',
        },
      });

      expect(root).toHaveClass(
        'engage__switch',
        'custom-root',
        'custom-label-end',
        'custom-disable-spacing'
      );
      expect(input).toHaveClass('engage__switch__input', 'custom-input', 'custom-large');
      expect(label).toHaveClass('engage__switch__label', 'custom-label');
    });

    it('should only add the class names of the modifiers when they apply', () => {
      const { root, input } = renderSwitch({
        classes: {
          labelEnd: 'custom-label-end',
          disableSpacing: 'custom-disable-spacing',
          large: 'custom-large',
        },
      });

      expect(root).not.toHaveClass('custom-label-end');
      expect(root).not.toHaveClass('custom-disable-spacing');
      expect(input).not.toHaveClass('custom-large');
    });

    it('should not let further attributes replace the ones it controls', () => {
      const onChange = jest.fn();
      const inputOnChange = jest.fn();
      const { input } = renderSwitch({
        checked: true,
        onChange,
        inputProps: {
          type: 'radio',
          id: 'other',
          onChange: inputOnChange,
        },
      });

      fireEvent.click(input);

      expect(input).toHaveAttribute('type', 'checkbox');
      expect(input).toHaveAttribute('id', 'test');
      expect(input).toBeChecked();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(inputOnChange).not.toHaveBeenCalled();
    });
  });
});
