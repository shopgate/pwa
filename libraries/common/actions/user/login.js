import {
  PipelineRequest,
  logger,
  EINVALIDCALL,
  ELEGACYSGCONNECT,
  EUNCOMPLETE,
} from '@shopgate/pwa-core';
import { SHOPGATE_USER_LOGIN_USER } from '../../constants/Pipelines';
import * as actions from '../../action-creators/user';

/**
 * Login the current user.
 * @param {Object} parameters The login credentials.
 * @param {string} parameters.login The username to login.
 * @param {string} parameters.password The password to login.
 * @param {string} redirect The location to redirect to when logged in.
 * @param {string} strategy basic or facebook, amazon, etc
 * @return {Function} A redux thunk.
 */
export default function login(parameters, redirect, strategy = 'basic') {
  return (dispatch) => {
    dispatch(actions.requestLogin(parameters.login, parameters.password, strategy));

    new PipelineRequest(SHOPGATE_USER_LOGIN_USER)
      .setTrusted()
      .setErrorBlacklist([
        EINVALIDCALL,
        ELEGACYSGCONNECT,
        EUNCOMPLETE,
      ])
      .setInput({
        strategy,
        parameters,
      })
      .dispatch()
      .then(({ success, messages }) => {
        if (success) {
          dispatch(actions.successLogin(redirect));
        } else {
          dispatch(actions.errorLogin(messages));
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
          dispatch(actions.successLogin(redirect));
        } else if (code === ELEGACYSGCONNECT) {
          /**
           * The app is connected to the shop system via the legacy shopgate connect. Login via
           * the shop system credentials failed and further steps are necessary to login the user.
           */
          dispatch(actions.errorLegacyConnectRegister());
          dispatch(actions.errorLogin([], ELEGACYSGCONNECT));
        } else {
          logger.error(error);
          dispatch(actions.errorLogin([], code));
        }
      });
  };
}
