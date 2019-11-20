import {
  PipelineRequest,
  logger,
  EINVALIDCALL,
  ELEGACYSGCONNECT,
  EINCOMPLETELOGIN,
} from '@shopgate/pwa-core';
import {
  requestLogin,
  successLogin,
  errorLogin,
  errorLegacyConnectRegister,
} from '../../action-creators/user';
import { SHOPGATE_USER_LOGIN_USER } from '../../constants/Pipelines';
import { DEFAULT_LOGIN_STRATEGY } from '../../constants/user';
import { mutable } from '../../helpers/redux';

/**
 * Login the current user.
 * @param {Object} parameters The login credentials.
 * @param {string} parameters.login The username to login.
 * @param {string} parameters.password The password to login.
 * @param {string} redirect The location to redirect to when logged in.
 * @param {string} strategy basic or facebook, amazon, etc
 * @return {Function} A redux thunk.
 */
function login(parameters, redirect, strategy = DEFAULT_LOGIN_STRATEGY) {
  return (dispatch) => {
    dispatch(requestLogin(parameters.login, parameters.password, strategy));

    const request = new PipelineRequest(SHOPGATE_USER_LOGIN_USER)
      .setTrusted()
      .setErrorBlacklist([
        EINVALIDCALL,
        ELEGACYSGCONNECT,
        EINCOMPLETELOGIN,
      ])
      .setInput({
        strategy,
        parameters,
      })
      .dispatch();

    request
      .then((result) => {
        const { success, messages } = result;

        if (success) {
          dispatch(successLogin(redirect, strategy));
        } else {
          dispatch(errorLogin(messages));
        }
      })
      .catch((error) => {
        const { code } = error;

        if (code === EINVALIDCALL) {
          /**
           * This code is thrown when the login request failed, because the user was already logged
           * in. In that situation the success action can also dispatch to trigger the necessary
           * processes which has to happen after a successful login.
           */
          dispatch(successLogin(redirect, strategy));
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

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(login);
