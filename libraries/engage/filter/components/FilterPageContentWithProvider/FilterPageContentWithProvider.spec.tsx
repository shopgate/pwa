import { render } from '@testing-library/react';
import { FilterPageProvider } from '../../providers';
import Content from '../FilterPageContent';
import FilterPageContentWithProvider from './FilterPageContentWithProvider';

jest.mock('../../providers', () => ({
  FilterPageProvider: jest.fn(({ children }) => children),
}));
jest.mock('../FilterPageContent', () => jest.fn(() => null));

/**
 * Reads the props of the first provider render.
 * @returns The props the provider was rendered with.
 */
const providerProps = () => (FilterPageProvider as unknown as jest.Mock).mock.calls[0][0];

describe('engage > filter > components > FilterPageContentWithProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass the filter sources to the provider and the app bar to the content', () => {
    const activeFilters = {
      color: {
        id: 'color',
        label: 'Color',
        source: 'filter',
        type: 'multiselect' as const,
        values: [{
          id: 'red',
          label: 'Red',
        }],
      },
    };
    const AppBar = () => null;

    render(
      <FilterPageContentWithProvider
        activeFilters={activeFilters}
        categoryId="shoes"
        parentRouteId="route-1"
        AppBarComponent={AppBar}
      />
    );

    expect(providerProps()).toEqual(expect.objectContaining({
      activeFilters,
      categoryId: 'shoes',
      searchPhrase: null,
      filters: null,
      parentRouteId: 'route-1',
    }));
    expect((Content as unknown as jest.Mock).mock.calls[0][0]).toEqual({ AppBarComponent: AppBar });
  });

  it('should pass null for props that are not set', () => {
    render(<FilterPageContentWithProvider />);

    expect(providerProps()).toEqual(expect.objectContaining({
      activeFilters: null,
      categoryId: null,
      searchPhrase: null,
      filters: null,
      parentRouteId: null,
    }));
    expect((Content as unknown as jest.Mock).mock.calls[0][0]).toEqual({ AppBarComponent: null });
  });
});
