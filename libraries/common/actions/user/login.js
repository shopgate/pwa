import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  EINVALIDCALL,
  ELEGACYSGCONNECT,
  EUNCOMPLETE,
} from '@shopgate/pwa-core/constants/Pipeline';
import { SHOPGATE_USER_LOGIN_USER } from '../../constants/Pipelines';
import {
  requestLogin,
  successLogin,
  errorLogin,
  errorLegacyConnectRegister,
} from '../../action-creators/user';

/**
 * Login the current user.
 * @param {Object} parameters login,password or open auth payload.
 * @param {string} strategy basic or facebook, amazon, etc
 * @return {Function} A redux thunk.
 */
export default (parameters, strategy = 'basic') => (dispatch) => {
  const { login, password } = parameters;

  dispatch(requestLogin(login, password, strategy));

  const params = {
    strategy,
    parameters,
  };

  new PipelineRequest(SHOPGATE_USER_LOGIN_USER)
    .setTrusted()
    .setHandledErrors([
      EINVALIDCALL,
      ELEGACYSGCONNECT,
      EUNCOMPLETE,
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
        dispatch(errorLogin([], ELEGACYSGCONNECT));
      } else {
        logger.error(error);
        dispatch(errorLogin([], code));
      }
    });
};
