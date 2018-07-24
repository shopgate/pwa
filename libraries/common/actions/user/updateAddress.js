import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { SHOPGATE_USER_UPDATE_ADDRESS } from '../../user/constants/Pipelines';
import { updateUser, updateUserSuccess } from '../../action-creators/user';

/**
 * @param {Object} address address
 * @return {function(*): *}
 */
export default address => (dispatch) => {
  dispatch(updateUser());

  return new PipelineRequest(SHOPGATE_USER_UPDATE_ADDRESS)
    .setTrusted()
    .setInput({ address })
    .dispatch()
    .then(() => {
      dispatch(updateUserSuccess());
    })
    .catch((error) => {
      logger.error(error);
    });
};
