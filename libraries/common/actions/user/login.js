import {
  PipelineRequest,
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
import appConfig from '../../helpers/config';

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
  return async (dispatch) => {
    const { enabled: recaptchaEnabled, siteKey } = appConfig?.recaptcha;
    dispatch(requestLogin(parameters.login, parameters.password, strategy));

    let recaptchaToken;
    if (recaptchaEnabled && siteKey) {
      recaptchaToken = await window.grecaptcha.enterprise.execute(siteKey, { action: 'login' });
    }

    const request = new PipelineRequest(SHOPGATE_USER_LOGIN_USER)
      .setTrusted()
      .setErrorBlacklist([
        EINVALIDCALL,
        ELEGACYSGCONNECT,
        EINCOMPLETELOGIN,
      ])
      .setInput({
        strategy,
        parameters: {
          ...parameters,
          ...(recaptchaToken ? { recaptchaToken } : null),
        },
      })
      .dispatch();

    request
      .then((result) => {
        const { success, messages, sessionLifetimeInSeconds } = result;

        if (success) {
          dispatch(successLogin(redirect, strategy, sessionLifetimeInSeconds));
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
          dispatch(errorLogin([], code));
        }
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(login);
