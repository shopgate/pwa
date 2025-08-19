import { ToastProvider } from '@shopgate/engage/core/providers';
import { i18n } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core/events';
import { SELECT_LOCATION } from '../constants';
import { sendDefaultLocationCode } from '../actions';

/**
 * @param {Object} params Action parameters.
 * @param {Object} params.location A location object.
 * @param {boolean} [params.showToast=false] Whether to show a toast message. That indicates the
 * location change.
 * @param {boolean} [params.skipLocationSync=false] When set to TRUE, the location will not be
 * synchronized with the backend.
 * @returns {Object}
 */
const selectLocation = params => async (dispatch) => {
  const {
    location,
    showToast = false,
    skipLocationSync = false,
  } = params;

  if (!skipLocationSync && location && location?.code) {
    await dispatch(sendDefaultLocationCode(location.code));
  }

  dispatch({
    type: SELECT_LOCATION,
    location,
    showToast,
  });

  if (showToast && location?.name) {
    UIEvents.emit(ToastProvider.ADD, {
      id: 'location.changed',
      message: i18n.text('location.preferredLocationChanged', { storeName: location.name }),
    });
  }
};

export default selectLocation;
