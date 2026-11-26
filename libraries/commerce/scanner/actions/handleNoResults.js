import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import Scanner from '@shopgate/pwa-core/classes/Scanner';
import errorHandleScanner from '../action-creators/errorHandleScanner';

/** @import { AppThunk } from '@shopgate/engage/core/types' */
/** @import { ScanResult } from '../types' */

/**
 * Handle no results
 * @param {ScanResult} event The scanned code.
 * @param {string} message The message to display.
 * @return {AppThunk<Promise<void>>} A redux thunk.
 */
const handleNoResult = ({ scope, format, payload }, message) => async (dispatch) => {
  dispatch(errorHandleScanner(scope, format, payload));
  Promise.resolve(dispatch(showModal({
    dismiss: null,
    confirm: 'modal.ok',
    title: 'modal.title_error',
    message,
  }))).then(confirmed => confirmed === true && Scanner.start());
};

/** @mixes {MutableFunction} */
export default mutable(handleNoResult);

