import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './index';

describe('engage > components > Switch', () => {
  it('should render a checkbox with its label and stable classes', () => {
    const { container } = render(<Switch id="test" checked onChange={jest.fn()}>Label</Switch>);

    const input = screen.getByRole('checkbox', { name: 'Label' });
    expect(input).toBeChecked();
    expect(input).toHaveClass('engage__switch__input');
    expect(container.firstChild).toHaveClass('engage__switch');
    expect(screen.getByText('Label').closest('label')).toHaveClass('engage__switch__label');
  });

  it('should call onChange when it is toggled', () => {
    const onChange = jest.fn();
    render(<Switch id="test" checked={false} onChange={onChange}>Label</Switch>);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
