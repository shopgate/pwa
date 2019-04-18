import handleSearch from './handleSearch';
import handleNoResults from './handleNoResults';
import successHandleScanner from '../action-creators/successHandleScanner';

/**
 * Handle bar code
 * @param {ScannerEvent} event Scanner event that emitted.
 * @param {string} format Format of the scanned code.
 * @param {string} payload Barcode payload.
 * @return {Function} A redux thunk.
 */
export default event => async (dispatch) => {
  const { scope, format, payload } = event;
  if (await dispatch(handleSearch(payload))) {
    dispatch(successHandleScanner(scope, format, payload));
  } else {
    dispatch(handleNoResults(event, 'scanner.noResult.barCode'));
  }
};

