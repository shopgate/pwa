import { historyReplace } from '@shopgate/pwa-common/actions/router';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search/helpers';
import handleSearch from './handleSearch';

jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyReplace: jest.fn(),
}));
jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery');

const searchPhrase = 'Food';

describe('handleSearch', () => {
  const dispatch = jest.fn(action => action);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should just return false when nothing was found, without performing any actions', async () => {
    fetchProductsByQuery.mockResolvedValue({
      products: [],
    });

    expect(await handleSearch(searchPhrase)(dispatch)).toBeFalsy();
  });

  it('should return true when the search handler performed any actions', async () => {
    fetchProductsByQuery.mockResolvedValue({
      products: ['1'],
    });

    expect(await handleSearch(searchPhrase)(dispatch)).toBeTruthy();
  });

  it('should navigate to PDP when exactly one product was found', async () => {
    fetchProductsByQuery.mockResolvedValue({
      products: [{ id: searchPhrase }],
    });

    await handleSearch(searchPhrase)(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, searchPhrase);
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: getProductRoute(searchPhrase),
    });
  });

  it('should navigate to PDP when exactly one hashed product is found', async () => {
    fetchProductsByQuery.mockResolvedValue({
      products: [searchPhrase],
    });

    await handleSearch(searchPhrase)(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, searchPhrase);
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: getProductRoute(searchPhrase),
    });
  });

  it('should navigate to the search page when multiple products have been found', async () => {
    fetchProductsByQuery.mockReturnValue(Promise.resolve({
      products: ['111', '222'],
    }));

    await handleSearch(searchPhrase)(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, searchPhrase);
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: getSearchRoute(searchPhrase),
    });
  });
});
