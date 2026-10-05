import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import SelectBox from './index';

/**
 * Mock Icon component.
 * @returns {JSX}
 */
const MockIconComponent = () => <span data-testid="icon" />;

/**
 * Mock Item component.
 * @param {Object} props The components props.
 * @param {JSX} props.children The components children.
 * @returns {JSX}
 */
const MockItemComponent = ({ children }) => (
  <div data-testid="item">
    {children}
  </div>
);

MockItemComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

describe('<SelectBox>', () => {
  const dummyItems = [
    {
      label: 'My item #1',
      value: 'item_1',
    },
    {
      label: 'My item #2',
      value: 'item_2',
    },
    {
      label: 'My item #3',
      value: 'item_3',
    },
  ];

  it('should render the selectbox with given mock components', () => {
    const { container } = render((
      <SelectBox icon={MockIconComponent} item={MockItemComponent} items={dummyItems} />
    ));

    const button = screen.getByRole('button', { name: 'filter.sort.default' });

    expect(container.firstChild).toHaveClass('common__select-box');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveAttribute('aria-controls', 'filter.sort.default');
    expect(button).toContainElement(screen.getByTestId('icon'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('id', 'filter.sort.default');
    expect(screen.getAllByTestId('item').map(item => item.textContent))
      .toEqual(['My item #1', 'My item #2', 'My item #3']);
    expect(screen.queryByRole('menuitem', {
      hidden: true,
      current: true,
    })).not.toBeInTheDocument();
  });

  it('should render with a default text', () => {
    render((
      <SelectBox
        icon={MockIconComponent}
        item={MockItemComponent}
        items={dummyItems}
        defaultText="Foo"
      />
    ));

    const button = screen.getByRole('button', { name: 'Foo' });

    expect(button).toHaveAttribute('aria-controls', 'Foo');
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('id', 'Foo');
  });

  it('should render with a preselected selection', () => {
    render((
      <SelectBox
        icon={MockIconComponent}
        item={MockItemComponent}
        items={dummyItems}
        defaultText="Foo"
        initialValue="item_2"
      />
    ));

    const button = screen.getByRole('button', { name: 'My item #2' });

    expect(button).toHaveAttribute('aria-controls', 'My item #2');
    expect(screen.queryByText('Foo')).not.toBeInTheDocument();
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('id', 'My item #2');
    const selectedItem = screen.getByRole('menuitem', {
      hidden: true,
      current: true,
    });

    expect(selectedItem).toHaveTextContent('My item #2');
    expect(selectedItem).not.toHaveClass('undefined');
  });
});
