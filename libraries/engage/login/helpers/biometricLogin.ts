import { Keychain } from '@shopgate/native-modules';
import type {
  AuthenticationPrompt,
  BiometryType as KeychainBiometryType,
  KeychainLoginStatus,
} from '@shopgate/native-modules';
import { appSupportsBiometricLogin } from '../../core/helpers/appFeatures';
import { getBiometricLoginErrorReason } from './biometricLoginErrors';
import type { BiometricLoginErrorReason } from './biometricLoginErrors';

/**
 * The kind of biometrics the app reports. iOS: TouchID, FaceID, OpticID.
 * Android: Fingerprint, Face, Iris.
 */
export type BiometryType = KeychainBiometryType;

/**
 * The state of the biometric login on the device: usable biometrics, stored credentials and the
 * kind of biometrics.
 */
export type BiometricLoginStatus = KeychainLoginStatus;

/**
 * The texts of the system prompt: `title`, and on Android also `subtitle`, `description` and
 * `cancel`.
 */
export type BiometricLoginPrompt = AuthenticationPrompt;

/**
 * The outcome of a call to the keychain of the app.
 */
export interface BiometricLoginResult {
  /**
   * Whether the call did what was asked for.
   */
  success: boolean;
  /**
   * The error code of the app or of the login pipeline.
   */
  code?: string;
  /**
   * The error message of the app or of the login pipeline.
   */
  message?: string;
  /**
   * Why the call failed, the same on iOS and Android. Only set when it failed.
   */
  reason?: BiometricLoginErrorReason;
}

/**
 * The params of `storeBiometricLogin`.
 */
export interface StoreBiometricLoginParams {
  /**
   * The username, as it was entered in the login form.
   */
  login: string;
  /**
   * The password, as it was entered in the login form.
   */
  password: string;
  /**
   * The texts of the system prompt that confirms storing the credentials.
   */
  prompt?: BiometricLoginPrompt;
}

export const keychain = Keychain;

/**
 * The result when the app resolves a call with `false` instead of rejecting it.
 */
const notDoneResult: BiometricLoginResult = {
  success: false,
  reason: 'unknown',
};

const unavailableStatus: BiometricLoginStatus = {
  available: false,
  enabled: false,
  biometryType: null,
};

/**
 * Converts a rejection of the app into a failed result.
 * @param error The value the app rejected with.
 * @returns The failed result with the reason, and the error code and message when the app
 * provided them.
 */
export const toBiometricLoginError = (error: unknown): BiometricLoginResult => {
  const { code, message } = (error ?? {}) as { code?: unknown; message?: unknown };
  const details = {
    ...(typeof code === 'string' ? { code } : null),
    ...(typeof message === 'string' ? { message } : null),
  };

  return {
    success: false,
    ...details,
    reason: getBiometricLoginErrorReason(details),
  };
};

/**
 * Determines whether the biometric login can be used and whether credentials are stored for it.
 * @returns The status. Never rejects: in apps without the feature flag of the biometric login,
 * and when the app can't tell, everything is reported as off.
 */
export const getBiometricLoginStatus = async (): Promise<BiometricLoginStatus> => {
  if (!appSupportsBiometricLogin()) {
    return unavailableStatus;
  }

  try {
    const status: Partial<BiometricLoginStatus> | undefined = await keychain.getLoginStatus();

    if (!status) {
      return unavailableStatus;
    }

    return {
      available: status.available === true,
      enabled: status.enabled === true,
      biometryType: status.biometryType ?? null,
    };
  } catch (error) {
    return unavailableStatus;
  }
};

/**
 * Stores login credentials in the keychain of the app for later biometric logins.
 * @param params The helper params.
 * @param params.login The username.
 * @param params.password The password.
 * @param params.prompt The texts for the system prompt.
 * @returns The result. Not successful when the user canceled the prompt or storing failed, also
 * when the app resolves with `false` instead of rejecting.
 */
export const storeBiometricLogin = async ({
  login,
  password,
  prompt,
}: StoreBiometricLoginParams): Promise<BiometricLoginResult> => {
  try {
    const stored = await keychain.setLogin(login, password, prompt);
    return stored === false ? notDoneResult : { success: true };
  } catch (error) {
    return toBiometricLoginError(error);
  }
};

/**
 * Removes the stored login credentials from the keychain of the app.
 * @returns The result. Not successful when removing failed, also when the app resolves with
 * `false` instead of rejecting.
 */
export const resetBiometricLogin = async (): Promise<BiometricLoginResult> => {
  try {
    const removed = await keychain.resetLogin();
    return removed === false ? notDoneResult : { success: true };
  } catch (error) {
    return toBiometricLoginError(error);
  }
};
