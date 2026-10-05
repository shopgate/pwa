import React, { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariantChips from './VariantChips';
import VariantSwatches from './VariantSwatches';
import type { VariantRendererProps, VariantSelectorValue } from '../types';

const values: VariantSelectorValue[] = [
  {
    id: 's', label: 'S', selectable: true, selected: true,
  },
  {
    id: 'm', label: 'M', selectable: true, selected: false, soldOut: true,
  },
  {
    id: 'l', label: 'L', selectable: false, selected: false,
  },
];

const renderProps = (props: Partial<VariantRendererProps> = {}): VariantRendererProps => ({
  charRef: createRef<HTMLElement>(),
  disabled: false,
  highlight: false,
  id: 'size',
  label: 'Size',
  selected: 's',
  swatch: false,
  values,
  select: jest.fn(),
  resetHighlight: jest.fn(),
  ...props,
});

describe('<VariantChips />', () => {
  it('renders the values as radio group with the selected value in the heading', () => {
    render(<VariantChips {...renderProps()} />);

    expect(screen.getByRole('radiogroup', { name: 'Size S' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'S' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'M' })).toHaveAttribute('data-sold-out', 'true');
    expect(screen.getByRole('radio', { name: 'L' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('selects sold out values but not values without variant', () => {
    const select = jest.fn();
    render(<VariantChips {...renderProps({ select })} />);

    fireEvent.click(screen.getByRole('radio', { name: 'M' }));
    fireEvent.click(screen.getByRole('radio', { name: 'L' }));

    expect(select).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledWith({ id: 'size', value: 'm' });
  });

  it('does not mark sold out values when disabled in the settings', () => {
    render(<VariantChips {...renderProps({ soldOutDisplay: 'none' })} />);

    expect(screen.getByRole('radio', { name: 'M' })).not.toHaveAttribute('data-sold-out');
  });

  it('exposes the layout', () => {
    render(<VariantChips {...renderProps({ chipsLayout: 'scroll' })} />);

    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-layout', 'scroll');
  });
});

describe('<VariantSwatches />', () => {
  const swatchValues: VariantSelectorValue[] = [
    {
      id: 'red', label: 'Red', selectable: true, selected: false, swatch: { color: '#f00' },
    },
    {
      id: 'blue', label: 'Blue', selectable: true, selected: true, swatch: { imageUrl: 'blue.jpg' },
    },
    {
      id: 'misc', label: 'Misc', selectable: true, selected: false,
    },
  ];

  it('renders colors, images and a chip fallback', () => {
    const select = jest.fn();
    render(<VariantSwatches {...renderProps({
      id: 'color', label: 'Color', selected: 'blue', values: swatchValues, select,
    })}
    />);

    expect(screen.getByRole('radio', { name: 'Red' })).toHaveStyle({ backgroundColor: '#f00' });
    expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Misc' })).toHaveClass('engage__variant-selector__chip');

    fireEvent.click(screen.getByRole('radio', { name: 'Red' }));
    expect(select).toHaveBeenCalledWith({ id: 'color', value: 'red' });
  });
});
