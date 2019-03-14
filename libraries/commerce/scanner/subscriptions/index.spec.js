/* eslint-disable extra-rules/no-single-line-objects */
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import ScannerEvent from '@shopgate/pwa-core/classes/ScannerEvent';
import { SCANNER_SCOPE_DEFAULT, SCANNER_TYPE_BARCODE } from '@shopgate/pwa-core/constants/Scanner';
import { appDidStart$ } from '@shopgate/pwa-common/streams';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductRoute } from '../../product/helpers';
import { getSearchRoute } from '../../search/helpers';
import { scanSuccess } from '../action-creators';
import subscriptions from './index';

jest.mock('@shopgate/pwa-core/classes/Scanner', () => ({
  addListener: jest.fn(),
  setHandler: jest.fn(),
  start: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/streams/app', () => ({
  appDidStart$: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/router', () => ({
  historyPush: jest.fn(),
}));
jest.mock('@shopgate/pwa-common/actions/modal/showModal');
jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery');
jest.mock('../action-creators', () => ({
  scanSuccess: jest.fn(),
}));

describe('scanner subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn(action => action);

  // Event from scanner
  const mockedEvent = new ScannerEvent(
    SCANNER_SCOPE_DEFAULT,
    SCANNER_TYPE_BARCODE,
    { format: 'EAN_13', code: '0000000000000' }
  );

  let appDidStartStream$;
  let appDidStartCallback;
  // eslint-disable-next-line no-unused-vars
  let scanSuccessBarCodeStream$;
  let scanSuccessBarCodeCallback;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    subscriptions(subscribe);
    [
      [appDidStartStream$, appDidStartCallback],
      [scanSuccessBarCodeStream$, scanSuccessBarCodeCallback],
    ] = subscribe.mock.calls;
  });

  it('should initialize subscriptions', () => {
    expect(subscribe).toHaveBeenCalledTimes(2);

    expect(appDidStartStream$).toEqual(appDidStart$);
    expect(appDidStartCallback).toBeInstanceOf(Function);
    expect(scanSuccessBarCodeCallback).toBeInstanceOf(Function);
  });

  it('should register handler and dispatch mapped action', () => {
    appDidStartCallback({ dispatch });

    expect(Scanner.addListener).toHaveBeenCalledTimes(1);
    const [[listenerActual]] = Scanner.addListener.mock.calls;
    expect(listenerActual.handler).toBeInstanceOf(Function);

    listenerActual.handler(mockedEvent);
    // Expect event to be mapped to stream
    expect(scanSuccess).toBeCalledWith(SCANNER_SCOPE_DEFAULT, 'EAN_13', '0000000000000');
  });

  it('should show modal when products not found', async () => {
    fetchProductsByQuery.mockReturnValue(Promise.resolve({
      totalProductCount: 0,
    }));
    showModal.mockImplementation(options => Promise.resolve(options));

    await scanSuccessBarCodeCallback({ dispatch, action: { payload: '000' } });
    expect(fetchProductsByQuery).toHaveBeenCalledWith(2, '000');
    expect(showModal).toHaveBeenCalledWith({
      confirm: null,
      title: 'category.no_result.heading',
      message: 'category.no_result.body',
    });
    expect(Scanner.start).toHaveBeenCalledTimes(1);
  });

  it('should navigate to PDP when 1 product is found', async () => {
    fetchProductsByQuery.mockReturnValue(Promise.resolve({
      totalProductCount: 1,
      products: [{ id: '100' }],
    }));

    await scanSuccessBarCodeCallback({ dispatch, action: { payload: '000' } });
    expect(historyPush).toHaveBeenCalledWith({
      pathname: getProductRoute('100'),
    });
  });

  it('should navigate to search when more products are found', async () => {
    fetchProductsByQuery.mockReturnValue(Promise.resolve({
      totalProductCount: 2,
    }));

    await scanSuccessBarCodeCallback({ dispatch, action: { payload: '000' } });
    expect(historyPush).toHaveBeenCalledWith({
      pathname: getSearchRoute('000'),
    });
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
