import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  EINVALIDCALL,
  ELEGACYSGCONNECT,
  EINVALIDCREDENTIALS,
} from '@shopgate/pwa-core/constants/Pipeline';
import errorManager from '@shopgate/pwa-core/classes/ErrorManager';
import { SHOPGATE_USER_LOGIN_USER } from '../../constants/Pipelines';
import {
  requestLogin,
  successLogin,
  errorLogin,
  errorLegacyConnectRegister,
} from '../../action-creators/user';

errorManager.setMessage({
  code: EINVALIDCREDENTIALS,
  context: SHOPGATE_USER_LOGIN_USER,
  message: 'login.error',
});

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

  new PipelineRequest(SHOPGATE_USER_LOGIN_USER)
    .setTrusted()
    .setHandledErrors([
      EINVALIDCALL,
      ELEGACYSGCONNECT,
    ])
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
      } else if (code === ELEGACYSGCONNECT) {
        /**
         * The app is connected to the shop system via the legacy shopgate connect. Login via
         * the shop system credentials failed and further steps are necessary to login the user.
         */
        dispatch(errorLegacyConnectRegister());
        dispatch(errorLogin());
      } else {
        logger.error(error);
        dispatch(errorLogin());
      }
    });
};
