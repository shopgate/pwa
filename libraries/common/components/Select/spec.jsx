import { render, screen, fireEvent } from '@testing-library/react';
import Select from './index';

/**
 * Helper to simulate toggling the open state by touching the handle area.
 */
const toggleOpen = () => {
  fireEvent.touchStart(screen.getByRole('presentation'));
};

/**
 * @param {HTMLElement} container The container of the rendered select.
 * @returns {HTMLElement|null} The element wrapping the select items.
 */
const getItemList = container => container.querySelector('[class$="-items"]');

describe('<Select />', () => {
  it('opens and closes the item list', () => {
    const { container } = render(<Select />);

    expect(getItemList(container)).not.toBeInTheDocument();

    toggleOpen();
    expect(getItemList(container)).toBeInTheDocument();

    toggleOpen();
    expect(getItemList(container)).not.toBeInTheDocument();
  });

  it('renders without items', () => {
    const { container } = render(<Select />);

    toggleOpen();

    expect(container.firstChild).toHaveClass('common_select');
    expect(screen.getByRole('presentation')).toHaveTextContent('Select ...▾');
    expect(getItemList(container)).toBeEmptyDOMElement();
  });

  it('renders with implicit items (closed)', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];

    const { container } = render(<Select items={items} />);

    expect(container.firstChild).toHaveClass('common_select');
    expect(screen.getByRole('presentation')).toHaveTextContent('Select ...▾');
    expect(getItemList(container)).not.toBeInTheDocument();
    items.forEach((item) => {
      expect(screen.queryByText(item)).not.toBeInTheDocument();
    });
  });

  it('renders with implicit items (opened)', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];

    const { container } = render(<Select items={items} />);
    toggleOpen();

    expect(screen.getByRole('presentation')).toHaveTextContent('Select ...▾');
    expect(Array.from(getItemList(container).children).map(item => item.textContent))
      .toEqual(items);
  });

  it('accepts implicit and explicit items', () => {
    const items = [
      'a',
      'b',
      {
        value: 'c',
      },
      'd',
      {
        value: 'e',
        label: 'E',
      },
      'f',
    ];

    const { container } = render(<Select items={items} />);

    toggleOpen();

    expect(screen.getByRole('presentation')).toHaveTextContent('Select ...▾');
    expect(Array.from(getItemList(container).children).map(item => item.textContent))
      .toEqual(['a', 'b', 'c', 'd', 'E', 'f']);
  });

  it('triggers callback on change', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];
    const selectionIndex = Math.floor(items.length / 2);
    const selectedValues = [];

    /**
     * Mocked callback for the onSelect event
     * @param {string} value Mocked value
     */
    const callback = (value) => {
      selectedValues.push(value);
    };

    const { container } = render((
      <Select
        items={items}
        onChange={callback}
      />
    ));

    toggleOpen();

    expect(Array.from(getItemList(container).children).map(item => item.textContent))
      .toEqual(items);

    fireEvent.touchEnd(screen.getByText(items[selectionIndex]));

    expect(selectedValues).toEqual([items[selectionIndex]]);
    expect(screen.getByRole('presentation')).toHaveTextContent(`${items[selectionIndex]}▾`);
    expect(getItemList(container)).not.toBeInTheDocument();
  });
});
