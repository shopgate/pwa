import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ValueCheckbox from './index';

describe('Filter: <ValueCheckbox />', () => {
  it('should render the raw label without translating it', () => {
    render(<ValueCheckbox id="blue" label="Blau" />);

    expect(screen.getByText('Blau')).toBeTruthy();
  });

  it('should expose the checked state', () => {
    render(<ValueCheckbox id="blue" label="Blau" isActive />);

    expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('true');
  });

  it('should expose a stable class and the selected state for custom styling', () => {
    const { container, rerender } = render(<ValueCheckbox id="blue" label="Blau" />);
    const root = container.querySelector('.engage__filter-page__selector__value');

    expect(root).not.toBeNull();
    expect(root.hasAttribute('data-selected')).toBe(false);

    rerender(<ValueCheckbox id="blue" label="Blau" isActive />);

    expect(root.hasAttribute('data-selected')).toBe(true);
  });

  it('should invoke onToggle with the value id', () => {
    const onToggle = jest.fn();
    render(<ValueCheckbox id="blue" label="Blau" onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledWith('blue');
  });
});
