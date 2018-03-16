import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { EINVALIDCALL } from '@shopgate/pwa-core/constants/Pipeline';
import {
  requestLogin,
  successLogin,
  errorLogin,
} from '../../action-creators/user';

/**
 * Login the current user.
 * @return {Function} A redux thunk.
 */
export default ({ login, password }) => (dispatch) => {
  dispatch(requestLogin(login, password));

  const params = {
    strategy: 'basic',
    parameters: {
      login,
      password,
    },
  };

  new PipelineRequest('shopgate.user.loginUser')
    .setTrusted()
    .setHandledErrors([EINVALIDCALL])
    .setInput(params)
    .dispatch()
    .then(({ success, messages }) => {
      if (success) {
        dispatch(successLogin());
      } else {
        dispatch(errorLogin(messages));
      }
    })
    .catch((error) => {
      const { code } = error;

      if (code === EINVALIDCALL) {
        /**
         * This code is thrown when the login request failed, because the user was already logged
         * in. In that situation the success action can also dispatch to trigger the neccesary
         * processes which have to happen after a successful login.
         */
        dispatch(successLogin());
      } else {
        logger.error(error);
        dispatch(errorLogin());
      }
    });
};
