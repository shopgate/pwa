import {
  PipelineRequest,
  logger,
  EINVALIDCALL,
  ELEGACYSGCONNECT,
  EUNCOMPLETE
} from '@shopgate/pwa-core';
import { SHOPGATE_USER_LOGIN_USER } from '../../constants/Pipelines';
import * as actions from '../../action-creators/user';

/**
 * Login the current user.
 * @param {Object} credentials The login credentials.
 * @param {string} credentials.login The username to login.
 * @param {string} credentials.password The password to login.
 * @param {string} redirect The location to redirect to when logged in.
 * @return {Function} A redux thunk.
 */
export default function login(credentials, redirect) {
  return (dispatch) => {
    dispatch(actions.requestLogin(credentials.login, credentials.password));

    new PipelineRequest(SHOPGATE_USER_LOGIN_USER)
      .setTrusted()
      .setErrorBlacklist([
        EINVALIDCALL,
        ELEGACYSGCONNECT,
        EUNCOMPLETE,
      ])
      .setInput({
        strategy: 'basic',
        parameters: credentials,
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
