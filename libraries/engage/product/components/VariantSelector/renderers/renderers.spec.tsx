import { createRef, type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariantChips from './VariantChips';
import VariantSwatches from './VariantSwatches';
import VariantInlineDropdown from './VariantInlineDropdown';
import type { VariantRendererProps, VariantSelectorValue } from '../types';

jest.mock('@shopgate/engage/a11y', () => ({
  VisuallyHidden: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));
jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: { text: (key: string, params?: string[]) => (params ? `${key}:${params.join(',')}` : key) },
}));

const values: VariantSelectorValue[] = [
  {
    id: 's',
    label: 'S',
    selectable: true,
    selected: true,
  },
  {
    id: 'm',
    label: 'M',
    selectable: true,
    selected: false,
    soldOut: true,
  },
  {
    id: 'l',
    label: 'L',
    selectable: false,
    selected: false,
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

    expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'S' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /^M ?, product.variant_sold_out$/ })).toHaveAttribute('data-sold-out', 'true');
    expect(screen.getByRole('radio', { name: 'L' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('selects sold out values but not values without variant', () => {
    const select = jest.fn();
    render(<VariantChips {...renderProps({ select })} />);

    fireEvent.click(screen.getByRole('radio', { name: /^M ?, product.variant_sold_out$/ }));
    fireEvent.click(screen.getByRole('radio', { name: 'L' }));

    expect(select).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledWith({
      id: 'size',
      value: 'm',
    });
  });

  it('marks values without variant as unavailable but keeps them selectable', () => {
    const select = jest.fn();
    render(<VariantChips {...renderProps({
      select,
      values: [{
        id: 'xl',
        label: 'XL',
        selectable: true,
        selected: false,
        available: false,
      }],
    })}
    />);

    const chip = screen.getByRole('radio', { name: /^XL ?, product.variant_unavailable$/ });
    expect(chip).toHaveAttribute('data-unavailable', 'true');

    fireEvent.click(chip);
    expect(select).toHaveBeenCalledWith({
      id: 'size',
      value: 'xl',
    });
  });

  it('has one tab stop and moves the selection with arrow keys', () => {
    const select = jest.fn();
    render(<VariantChips {...renderProps({
      select,
      values: [
        {
          id: 's',
          label: 'S',
          selectable: true,
          selected: true,
        },
        {
          id: 'm',
          label: 'M',
          selectable: true,
          selected: false,
        },
        {
          id: 'l',
          label: 'L',
          selectable: false,
          selected: false,
        },
        {
          id: 'xl',
          label: 'XL',
          selectable: true,
          selected: false,
        },
      ],
    })}
    />);

    const radios = screen.getAllByRole('radio');
    expect(radios.map(radio => radio.tabIndex)).toEqual([0, -1, -1, -1]);

    radios[0].focus();
    fireEvent.keyDown(radios[0], { key: 'ArrowRight' });
    expect(radios[1]).toHaveFocus();
    expect(select).toHaveBeenLastCalledWith({
      id: 'size',
      value: 'm',
    });

    fireEvent.keyDown(radios[1], { key: 'ArrowRight' });
    expect(radios[3]).toHaveFocus();

    fireEvent.keyDown(radios[3], { key: 'Home' });
    expect(radios[0]).toHaveFocus();
    expect(select).toHaveBeenLastCalledWith({
      id: 'size',
      value: 's',
    });
  });

  it('exposes the layout', () => {
    render(<VariantChips {...renderProps({ chipsLayout: 'scroll' })} />);

    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-layout', 'scroll');
  });
});

jest.mock('@shopgate/engage/components', () => ({ ArrowDropIcon: () => null }));
describe('<VariantInlineDropdown />', () => {
  it('expands the values inline and collapses after a selection', () => {
    const select = jest.fn();
    render(<VariantInlineDropdown {...renderProps({
      select,
      selected: null,
    })}
    />);

    const field = screen.getByRole('button', { name: /Size/ });
    expect(field).toHaveTextContent('common.please_choose');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    fireEvent.click(field);
    expect(field).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('radio', { name: /^M ?, product.variant_sold_out$/ })).toHaveAttribute('data-sold-out', 'true');

    fireEvent.click(screen.getByRole('radio', { name: /^M ?, product.variant_sold_out$/ }));
    expect(select).toHaveBeenCalledWith({
      id: 'size',
      value: 'm',
    });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

describe('<VariantSwatches />', () => {
  const swatchValues: VariantSelectorValue[] = [
    {
      id: 'red',
      label: 'Red',
      selectable: true,
      selected: false,
      swatch: { color: '#f00' },
    },
    {
      id: 'blue',
      label: 'Blue',
      selectable: true,
      selected: true,
      swatch: { imageUrl: 'blue.jpg' },
    },
    {
      id: 'misc',
      label: 'Misc',
      selectable: true,
      selected: false,
    },
  ];

  it('renders colors, images and a chip fallback', () => {
    const select = jest.fn();
    render(<VariantSwatches {...renderProps({
      id: 'color',
      label: 'Color',
      selected: 'blue',
      values: swatchValues,
      select,
    })}
    />);

    expect(screen.getByRole('radio', { name: 'Red' })).toHaveStyle({ backgroundColor: '#f00' });
    expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Misc' })).toHaveClass('engage__variant-selector__chip');

    fireEvent.click(screen.getByRole('radio', { name: 'Red' }));
    expect(select).toHaveBeenCalledWith({
      id: 'color',
      value: 'red',
    });
  });

  it('renders square swatches and zooms images', () => {
    render(<VariantSwatches {...renderProps({
      id: 'color',
      label: 'Color',
      selected: null,
      values: swatchValues,
      swatchShape: 'square',
      swatchImageZoom: 250,
    })}
    />);

    const blue = screen.getByRole('radio', { name: 'Blue' });
    expect(blue).toHaveAttribute('data-shape', 'square');
    expect(blue).toHaveStyle({ backgroundSize: '250%' });
  });
});
