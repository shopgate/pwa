/* eslint-disable extra-rules/no-single-line-objects */
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductRoute } from '@shopgate/pwa-common-commerce/product/helpers';
import { getSearchRoute } from '@shopgate/pwa-common-commerce/search/helpers';
import successHandleScanner from '../action-creators/successHandleScanner';
import errorHandleScanner from '../action-creators/errorHandleScanner';
import handleBarCode from './handleBarCode';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyReplace: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/modal/showModal', () => (
  jest.fn().mockResolvedValue(true)
));
jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery');

const scope = SCANNER_SCOPE_DEFAULT;
const format = 'EAN_13';

describe('handleBarCode', () => {
  const dispatch = jest.fn(action => action);
  const scannerStart = jest.spyOn(Scanner, 'start').mockImplementation(() => {});

  const modalContent = {
    dismiss: null,
    confirm: 'modal.ok',
    title: 'modal.title_error',
    message: 'scanner.noResult.barCode',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show modal when products not found', async () => {
    fetchProductsByQuery.mockResolvedValue({
      products: [],
    });

    const payload = '111111';

    await handleBarCode({ scope, format, payload })(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, payload);
    expect(dispatch).toHaveBeenCalledWith(errorHandleScanner(scope, format, payload));
    expect(showModal).toHaveBeenCalledWith(modalContent);
    expect(scannerStart).toHaveBeenCalledTimes(1);
  });

  it('should navigate to PDP when 1 product is found', async () => {
    const payload = '222222';

    fetchProductsByQuery.mockResolvedValue({
      totalProductCount: 1,
      products: [{ id: payload }],
      products: [{ id: '222222' }],
    });

    await handleBarCode({ scope, format, payload })(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, payload);
    expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: getProductRoute(payload),
    });
  });

  it('should navigate to PDP when 1 hashed product is found', async () => {
    fetchProductsByQuery.mockResolvedValue({
      products: ['222222'],
    });

    await handleBarCode('222222')(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, '222222');
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: getProductRoute('222222'),
    });
  });

  it('should navigate to search when more products are found', async () => {
    const payload = '333333';
    fetchProductsByQuery.mockReturnValue(Promise.resolve({
      products: ['111', '222'],
    }));

    await handleBarCode({ scope, format, payload })(dispatch);
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, payload);
    expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
    expect(historyReplace).toHaveBeenCalledWith({
      pathname: getSearchRoute(payload),
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
