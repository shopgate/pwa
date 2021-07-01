import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import config from '../config';

export default () => (dispatch) => {
  if (!config.isActive) {
    return;
  }

  new PipelineRequest('shopgate.user.deleteAccount')
    .setHandleErrors(ERROR_HANDLE_SUPPRESS)
    .dispatch()
    .then(() => {
      dispatch({
        type: 'DELETE_ACCOUNT_SUCCESS',
      });
    })
    .catch((error) => {
      dispatch({
        type: 'DELETE_ACCOUNT_FAILED',
        error,
      });
    });
};
