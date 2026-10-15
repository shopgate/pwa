import { Keychain } from '@shopgate/native-modules';
import { getBiometricLoginErrorReason } from './biometricLoginErrors';
import type { BiometricLoginErrorReason } from './biometricLoginErrors';

/**
 * The kind of biometrics the app reports. iOS: TouchID, FaceID, OpticID.
 * Android: Fingerprint, Face, Iris.
 */
export type BiometryType = 'TouchID' | 'FaceID' | 'OpticID' | 'Fingerprint' | 'Face' | 'Iris';

/**
 * The state of the biometric login on the device.
 */
export interface BiometricLoginStatus {
  /**
   * Whether the device has biometrics that are enrolled and usable by the app.
   */
  available: boolean;
  /**
   * Whether a credential is stored for the biometric login.
   */
  enabled: boolean;
  /**
   * The kind of biometrics of the device, `null` when none is available.
   */
  biometryType: BiometryType | null;
}

/**
 * The texts of the system prompt. iOS only shows the title.
 */
export interface BiometricLoginPrompt {
  /**
   * The reason for the prompt, e.g. "Sign in to the shop".
   */
  title: string;
  /**
   * A second line below the title (Android only).
   */
  subtitle?: string;
  /**
   * A longer explanation below the subtitle (Android only).
   */
  description?: string;
  /**
   * The label of the cancel button (Android only).
   */
  cancel?: string;
}

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

/**
 * The Keychain module with the prompt parameters that 1.1.0-alpha.2 of the package doesn't
 * declare yet.
 */
interface KeychainClient {
  /**
   * Resolves with the state of the biometric login. Rejects in apps without the feature.
   */
  getLoginStatus(): Promise<Partial<BiometricLoginStatus> | undefined>;
  /**
   * Stores the credentials behind the biometrics of the device.
   */
  setLogin(username: string, password: string, prompt?: BiometricLoginPrompt): Promise<boolean>;
  /**
   * Shows the biometric prompt and sends the login request with the stored credentials.
   * Resolves with the response of the login pipeline.
   */
  login(recaptchaToken?: string, prompt?: BiometricLoginPrompt): Promise<{
    pipelineResponse?: unknown;
  } | undefined>;
  /**
   * Removes the stored credentials.
   */
  resetLogin(): Promise<boolean>;
}

export const keychain = Keychain as unknown as KeychainClient;

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
 * @returns The status. Never rejects: without support by the app everything is reported as off.
 */
export const getBiometricLoginStatus = async (): Promise<BiometricLoginStatus> => {
  try {
    const status = await keychain.getLoginStatus();

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
 * @returns The result. Not successful when the user canceled the prompt or storing failed.
 */
export const storeBiometricLogin = async ({
  login,
  password,
  prompt,
}: StoreBiometricLoginParams): Promise<BiometricLoginResult> => {
  try {
    await keychain.setLogin(login, password, prompt);
    return { success: true };
  } catch (error) {
    return toBiometricLoginError(error);
  }
};

/**
 * Removes the stored login credentials from the keychain of the app.
 * @returns The result.
 */
export const resetBiometricLogin = async (): Promise<BiometricLoginResult> => {
  try {
    await keychain.resetLogin();
    return { success: true };
  } catch (error) {
    return toBiometricLoginError(error);
  }
};
