import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import errorHandleScanner from '../action-creators/errorHandleScanner';

/**
 * Handle no results
 * @param {string} event.scope Scanner scope.
 * @param {string} event.format Format of the scanned code.
 * @param {string} event.payload Barcode payload.
 * @param {string} message The message to display.
 * @return {Function} A redux thunk.
 */
export default ({ scope, format, payload }, message) => async (dispatch) => {
  dispatch(errorHandleScanner(scope, format, payload));
  dispatch(showModal({
    dismiss: null,
    confirm: 'modal.ok',
    title: 'modal.title_error',
    message,
  })).then(confirmed => confirmed && Scanner.start());
};

