import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search/helpers';
import handleBarCode from './handleBarCode';

jest.mock('@shopgate/pwa-core/classes/Scanner', () => ({
  start: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyPush: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => (
  jest.fn(options => Promise.resolve(options))
));
jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery');

describe('handleBarCode', () => {
  const dispatch = jest.fn(action => action);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show modal when products not found', async () => {
    fetchProductsByQuery.mockResolvedValue({
      totalProductCount: 0,
    });

    await handleBarCode('111111')(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, '111111');
    expect(showModal).toHaveBeenCalledWith({
      confirm: null,
      title: 'category.no_result.heading',
      message: 'category.no_result.body',
    });
    expect(Scanner.start).toHaveBeenCalledTimes(1);
  });

  it('should navigate to PDP when 1 product is found', async () => {
    fetchProductsByQuery.mockResolvedValue({
      totalProductCount: 1,
      products: [{ id: '222222' }],
    });

    await handleBarCode('222222')(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, '222222');
    expect(historyPush).toHaveBeenCalledWith({
      pathname: getProductRoute('222222'),
    });
  });

  it('should navigate to search when more products are found', async () => {
    fetchProductsByQuery.mockReturnValue(Promise.resolve({
      totalProductCount: 2,
    }));

    await handleBarCode('333333')(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, '333333');
    expect(historyPush).toHaveBeenCalledWith({
      pathname: getSearchRoute('333333'),
    });
  });
});
