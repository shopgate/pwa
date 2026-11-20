import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useWidget } from '@shopgate/engage/page/hooks';
import ProductTabs from './ProductTabs';

jest.mock('@shopgate/engage/page/hooks', () => ({
  useWidget: jest.fn(),
}));
jest.mock('@shopgate/engage/components', () => ({
  Typography: ({ children, id }: { children: string; id: string }) => <h2 id={id}>{children}</h2>,
}));
jest.mock('../ProductSlider', () => {
  const { useContext } = jest.requireActual('react');
  const { WidgetContext } = jest.requireActual('@shopgate/engage/page/components/Widgets');

  return () => {
    const { config } = useContext(WidgetContext);
    return <p>{`${config.products.searchTerm} ${config.productCount} ${config.showName}`}</p>;
  };
});

const tabs = [
  {
    label: 'New',
    products: { searchTerm: 'new' },
  },
  {
    label: 'Bestsellers',
    products: { searchTerm: 'top' },
  },
  {
    label: 'Sale',
    products: { searchTerm: 'sale' },
  },
];

const renderTabs = (config: object) => {
  (useWidget as jest.Mock).mockReturnValue({
    code: 'w1',
    config: {
      tabs,
      productCount: 20,
      showName: true,
      ...config,
    },
  });
  return render(<ProductTabs />);
};

const selectedTab = () => screen.getByRole('tab', { selected: true });

describe('<ProductTabs />', () => {
  it('shows the tab names and the products of the first tab', () => {
    renderTabs({});

    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual(['New', 'Bestsellers', 'Sale']);
    expect(selectedTab()).toHaveTextContent('New');
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('New');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('new 20 true');
  });

  it('shows the products of a tab on tap', () => {
    renderTabs({});

    fireEvent.click(screen.getByRole('tab', { name: 'Sale' }));

    expect(selectedTab()).toHaveTextContent('Sale');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('sale 20 true');
  });

  it('moves between the tabs with the arrow keys, Home and End', () => {
    renderTabs({});

    fireEvent.keyDown(selectedTab(), { key: 'ArrowLeft' });
    expect(selectedTab()).toHaveTextContent('Sale');
    expect(selectedTab()).toHaveFocus();

    fireEvent.keyDown(selectedTab(), { key: 'ArrowRight' });
    expect(selectedTab()).toHaveTextContent('New');

    fireEvent.keyDown(selectedTab(), { key: 'End' });
    expect(selectedTab()).toHaveTextContent('Sale');

    fireEvent.keyDown(selectedTab(), { key: 'Home' });
    expect(selectedTab()).toHaveTextContent('New');
  });

  it('applies the card settings to all tabs', () => {
    renderTabs({ showName: false });

    fireEvent.click(screen.getByRole('tab', { name: 'Bestsellers' }));

    expect(screen.getByRole('tabpanel')).toHaveTextContent('top 20 false');
  });

  it('names the tabs by the headline when it is shown', () => {
    renderTabs({
      showHeadline: true,
      headline: { text: 'Discover' },
    });

    expect(screen.getByRole('tablist')).toHaveAccessibleName('Discover');
  });

  it('renders nothing without tabs', () => {
    const { container } = renderTabs({ tabs: [] });

    expect(container).toBeEmptyDOMElement();
  });
});
