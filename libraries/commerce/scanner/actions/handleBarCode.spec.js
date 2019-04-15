/* eslint-disable extra-rules/no-single-line-objects */
import { SCANNER_SCOPE_DEFAULT } from '@shopgate/pwa-core/constants/Scanner';
import successHandleScanner from '../action-creators/successHandleScanner';
import handleBarCode from './handleBarCode';
import handleSearch from './handleSearch';
import handleNoResults from './handleNoResults';

jest.mock('./handleSearch');
jest.mock('./handleNoResults');

const scope = SCANNER_SCOPE_DEFAULT;
const format = 'EAN_13';
const payload = '123456';

describe('handleBarCode', () => {
  const dispatch = jest.fn(action => action);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use the product search', async () => {
    const event = { scope, format, payload };

    await handleBarCode(event)(dispatch);
    expect(handleSearch).toHaveBeenCalledWith(payload);
  });

  it("should trigger handling of no results when the search didn't find anything", async () => {
    const event = { scope, format, payload };
    handleSearch.mockResolvedValue(false);

    await handleBarCode(event)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(handleNoResults(event, 'scanner.noResult.barCode'));
  });

  it('should inform with a success event if the search handler did its job', async () => {
    const event = { scope, format, payload };
    handleSearch.mockResolvedValue(true);

    await handleBarCode(event)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(successHandleScanner(scope, format, payload));
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
