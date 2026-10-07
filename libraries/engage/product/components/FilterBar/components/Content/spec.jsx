/* eslint-disable react/prop-types */
import {
  render, screen, fireEvent, within, act,
} from '@testing-library/react';
import { router } from '@virtuous/conductor';
import { updateFilters } from '@shopgate/pwa-common-commerce/filter/action-creators';
import {
  FILTER_TYPE_MULTISELECT,
  FILTER_TYPE_RANGE,
} from '@shopgate/pwa-common-commerce/filter/constants';
import { useRoute } from '@shopgate/engage/core';
import { i18n } from '@shopgate/engage/core/helpers';
import { ViewContext } from '@shopgate/engage/components/View';
import FilterBarContext from '../../FilterBarProvider.context';
import FilterBarContent from './index';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));
jest.mock('@virtuous/conductor', () => ({
  router: {
    update: jest.fn(),
  },
}));
jest.mock('@shopgate/engage/core', () => ({
  useRoute: jest.fn(),
}));
jest.mock('@shopgate/engage/filter', () => ({
  ...jest.requireActual('@shopgate/pwa-common-commerce/filter/constants'),
  translateFilterLabel: (id, label) => label,
}));
jest.mock('@shopgate/engage/components', () => ({
  Badge: ({ count }) => (count ? <span>{count}</span> : null),
  CrossIcon: () => null,
  FilterIcon: () => null,
  I18n: {
    Text: ({ string }) => string,
  },
  Typography: ({ children }) => <span>{children}</span>,
}));
jest.mock('@shopgate/engage/components/View', () => {
  const { createContext } = jest.requireActual('react');

  return { ViewContext: createContext({}) };
});
jest.mock('./components/Sort', () => () => null);

const routeId = 'route-id';

const filters = {
  size: {
    id: 'size',
    label: 'Size',
    type: FILTER_TYPE_MULTISELECT,
    value: [
      {
        id: '31',
        label: 'Small',
      },
      {
        id: '32',
        label: 'Medium',
      },
    ],
  },
  color: {
    id: 'color',
    label: 'Color',
    type: FILTER_TYPE_MULTISELECT,
    value: [
      {
        id: 'red',
        label: 'Red',
      },
    ],
  },
};

const priceFilter = {
  display_amount: {
    id: 'display_amount',
    label: 'Price',
    type: FILTER_TYPE_RANGE,
    value: [1000, 2000],
  },
};

describe('<FilterBarContent />', () => {
  const openFilters = jest.fn();
  const scrollTop = jest.fn();

  /**
   * @param {Object} routeFilters The active filters of the route.
   * @param {Object} props The component props.
   * @returns {Object} The render result.
   */
  const renderComponent = (routeFilters, props = {}) => {
    useRoute.mockReturnValue({
      id: routeId,
      state: { filters: routeFilters },
    });

    return render((
      <ViewContext.Provider value={{ scrollTop }}>
        <FilterBarContext.Provider value={{ openFilters }}>
          <FilterBarContent {...props} />
        </FilterBarContext.Provider>
      </ViewContext.Provider>
    ));
  };

  /**
   * @param {string} label The chip label.
   * @returns {HTMLElement} The chip which shows the label.
   */
  const getChip = label => screen.getByText(label).parentElement;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should open the filters when the filter button is clicked', () => {
    renderComponent(null);

    fireEvent.click(screen.getByRole('button', { name: 'titles.filter' }));

    expect(openFilters).toHaveBeenCalledTimes(1);
  });

  it('should show the count of the active filters at the filter button', () => {
    renderComponent(filters, { filterCount: 2 });

    expect(screen.getByRole('button', { name: 'titles.filter' })).toHaveTextContent('2');
  });

  it('should not render chips without active filters', () => {
    const onChipCountUpdate = jest.fn();

    renderComponent(null, { onChipCountUpdate });

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(onChipCountUpdate).toHaveBeenCalledWith(0);
  });

  it('should render a chip for every active filter value', () => {
    const onChipCountUpdate = jest.fn();

    renderComponent(filters, { onChipCountUpdate });

    expect(screen.getByText('Size: Small')).toBeInTheDocument();
    expect(screen.getByText('Size: Medium')).toBeInTheDocument();
    expect(screen.getByText('Color: Red')).toBeInTheDocument();
    expect(onChipCountUpdate).toHaveBeenCalledWith(3);
  });

  it('should render a chip for a price range', () => {
    jest.spyOn(i18n, 'price').mockImplementation(value => String(value));

    renderComponent(priceFilter);

    expect(screen.getByText('10 - 20')).toBeInTheDocument();
  });

  it('should open the filters when a chip is clicked', () => {
    renderComponent(filters);

    fireEvent.click(screen.getByText('Color: Red'));

    expect(openFilters).toHaveBeenCalledTimes(1);
  });

  it('should remove a filter when its only value is removed', () => {
    renderComponent(filters);

    fireEvent.click(within(getChip('Color: Red')).getByRole('button', { name: 'filter.remove' }));

    const expected = { size: filters.size };

    expect(router.update).toHaveBeenCalledWith(routeId, { filters: expected });
    expect(mockDispatch).toHaveBeenCalledWith(updateFilters(expected));
    expect(scrollTop).toHaveBeenCalledTimes(1);
  });

  it('should only remove the value when a filter has further values', () => {
    renderComponent(filters);

    fireEvent.click(within(getChip('Size: Small')).getByRole('button', { name: 'filter.remove' }));

    expect(router.update).not.toHaveBeenCalled();

    act(() => {
      jest.runOnlyPendingTimers();
    });

    const expected = {
      ...filters,
      size: {
        ...filters.size,
        value: [filters.size.value[1]],
      },
    };

    expect(router.update).toHaveBeenCalledWith(routeId, { filters: expected });
    expect(mockDispatch).toHaveBeenCalledWith(updateFilters(expected));
    expect(scrollTop).toHaveBeenCalledTimes(1);
  });

  it('should reset the filters when the last one is removed', () => {
    renderComponent({ color: filters.color });

    fireEvent.click(screen.getByRole('button', { name: 'filter.remove' }));

    expect(router.update).toHaveBeenCalledWith(routeId, { filters: null });
    expect(mockDispatch).toHaveBeenCalledWith(updateFilters(null));
    expect(scrollTop).toHaveBeenCalledTimes(1);
  });

  it('should offer to clear all filters when there are more than three chips', () => {
    renderComponent({
      ...filters,
      ...priceFilter,
    });

    fireEvent.click(screen.getByRole('button', { name: 'filter.clear_all' }));

    expect(router.update).toHaveBeenCalledWith(routeId, { filters: null });
    expect(mockDispatch).toHaveBeenCalledWith(updateFilters(null));
    expect(scrollTop).toHaveBeenCalledTimes(1);
  });

  it('should not offer to clear all filters for up to three chips', () => {
    renderComponent(filters);

    expect(screen.queryByRole('button', { name: 'filter.clear_all' })).not.toBeInTheDocument();
  });
});
/* eslint-enable react/prop-types */
