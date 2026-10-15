import { LoadingProvider } from '../../core/providers';
import { getCurrentPathname } from '../../core/selectors';
import { getRecaptchaToken } from '../../core/helpers/recaptcha';
import { successLogin } from '../../user/action-creators';
import { DEFAULT_LOGIN_STRATEGY } from '../../user/constants';
import { LOGIN_SOURCE_BIOMETRIC } from '../constants/sources';
import type { AppThunk } from '../../core/types';
import { keychain, toBiometricLoginError } from '../helpers/biometricLogin';
import type { BiometricLoginPrompt, BiometricLoginResult } from '../helpers/biometricLogin';

/**
 * The params of the `biometricLogin` action.
 */
export interface BiometricLoginParams {
  /**
   * The texts of the system prompt that asks for the biometrics.
   */
  prompt?: BiometricLoginPrompt;
}

/**
 * The part of the login pipeline response that the action reads.
 */
interface LoginPipelineResponse {
  /**
   * Whether the credentials were accepted.
   */
  success?: boolean;
  /**
   * The time until the session expires and the user is logged out automatically.
   */
  sessionLifetimeInSeconds?: number;
}

/**
 * Logs the user in with the credentials from the keychain of the app. The app shows the biometric
 * prompt and sends the login request itself, so the credentials don't reach the web layer.
 * The user stays on the current page after a successful login, and the `SUCCESS_LOGIN` action
 * carries `LOGIN_SOURCE_BIOMETRIC` as its source. The current page shows its loading
 * state while the action runs.
 * @param params The action params.
 * @param params.prompt The texts for the system prompt.
 * @returns A redux thunk that resolves with the result. It carries the error code of the app or
 * the login pipeline when the login failed.
 */
const biometricLogin = (
  { prompt }: BiometricLoginParams = {}
): AppThunk<Promise<BiometricLoginResult>> => async (dispatch, getState) => {
  const pathname: string = getCurrentPathname(getState());

  LoadingProvider.setLoading(pathname);

  try {
    const recaptchaToken = await getRecaptchaToken('login');
    const response = await keychain.login(recaptchaToken, prompt);
    const {
      success,
      sessionLifetimeInSeconds,
    } = (response?.pipelineResponse ?? {}) as LoginPipelineResponse;

    if (!success) {
      return {
        success: false,
        reason: 'unknown',
      };
    }

    dispatch(successLogin(false, DEFAULT_LOGIN_STRATEGY, sessionLifetimeInSeconds, {
      source: LOGIN_SOURCE_BIOMETRIC,
    }));

    return { success: true };
  } catch (error) {
    return toBiometricLoginError(error);
  } finally {
    LoadingProvider.unsetLoading(pathname);
  }
};

export default biometricLogin;
